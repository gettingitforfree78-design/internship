const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Application = require('../models/Application');
const OfferLetter = require('../models/OfferLetter');
const ApplicantData = require('../models/ApplicantData');
const { saveToJsonFile, savePaymentToCsv } = require('../utils/saveApplicantJson');
const { generateOfferLetterPDF } = require('../services/offerLetterService');
const { sendOfferLetterEmail } = require('../services/offerLetterEmailService');

// @desc  Submit internship application form
// @route POST /api/applications
// @access Private
exports.submitApplication = async (req, res) => {
  try {
    const {
      fullName, email, phone, college, course,
      startDate, endDate, mode, stipend, address,
    } = req.body;

    if (!fullName || !email || !phone || !college || !course || !startDate || !endDate || !mode || !stipend) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    // Check if already has a pending/paid application
    const existing = await Application.findOne({ userId: req.user._id, paymentStatus: 'paid' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active internship application.' });
    }

    // Remove any old pending application
    await Application.deleteMany({ userId: req.user._id, paymentStatus: 'pending' });

    const app = await Application.create({
      userId: req.user._id,
      fullName, email, phone, college, course,
      startDate, endDate, mode, stipend,
      address: address || '',
      internshipRole: 'General Internship',
    });

    // Save all data to the unique phone number MongoDB collection
    await ApplicantData.findOneAndUpdate(
      { phone },
      { rawData: req.body },
      { upsert: true, new: true }
    );

    // Save to the physical JSON file
    saveToJsonFile(phone, req.body);

    res.status(201).json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// NOTE: Razorpay functions (createOrder/verifyPayment) have been removed.
// The app now uses confirmUpiPayment for manual verification.

// @desc  Get my applications
// @route GET /api/applications/my
// @access Private
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Download offer letter PDF
// @route GET /api/applications/download/:id
// @access Private
exports.downloadOfferLetter = async (req, res) => {
  try {
    // Support both OfferLetter ID and Application ID for flexibility
    const ol = await OfferLetter.findOne({ 
      $or: [
        { _id: require('mongoose').Types.ObjectId.isValid(req.params.id) ? req.params.id : null },
        { applicationId: require('mongoose').Types.ObjectId.isValid(req.params.id) ? req.params.id : null },
        { offerLetterId: req.params.id }
      ].filter(q => q !== null),
      userId: req.user._id 
    });

    if (!ol) return res.status(404).json({ success: false, message: 'Offer letter not found' });
    
    const safeName = ol.studentName.replace(/\s+/g, '_');
    if (ol.pdfBuffer) {
      const isDocx = ol.pdfPath && ol.pdfPath.endsWith('.docx');
      const ext = isDocx ? '.docx' : '.pdf';
      const contentType = isDocx 
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        : 'application/pdf';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="Offer_Letter_${safeName}${ext}"`);
      
      // Extract native Buffer from MongoDB Binary
      let rawBuffer;
      if (Buffer.isBuffer(ol.pdfBuffer)) {
        rawBuffer = ol.pdfBuffer;
      } else if (ol.pdfBuffer.buffer) {
        rawBuffer = Buffer.from(ol.pdfBuffer.buffer);
      } else {
        // Fallback for weird serialization
        rawBuffer = Buffer.from(ol.pdfBuffer);
      }
      
      return res.end(rawBuffer);
    } else if (ol.pdfPath && fs.existsSync(ol.pdfPath)) {
      const ext = require('path').extname(ol.pdfPath) || '.pdf';
      return res.download(ol.pdfPath, `Offer_Letter_${safeName}${ext}`);
    } else {
      return res.status(404).json({ success: false, message: 'Offer letter file not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Admin: get all applications
// @route GET /api/applications/all
// @access Admin
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Skip Payment (Temporary)
// @route POST /api/applications/skip-payment
// @access Private
exports.skipPayment = async (req, res) => {
  try {
    const { applicationId } = req.body;

    const application = await Application.findOne({ _id: applicationId, userId: req.user._id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.paymentStatus === 'paid') return res.status(400).json({ success: false, message: 'Already paid' });

    // Mark as paid with mock details
    application.paymentStatus = 'paid';
    application.paymentMethod = 'upi_qr';
    application.upiTransactionId = `SKIPPED_${Date.now()}`;
    application.amount = 0;

    // Generate unique offer letter ID
    const offerLetterId = `LP-OL-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;
    application.offerLetterId = offerLetterId;
    await application.save();

    // Generate PDF & send email
    let pdfPath = null;
    let emailSent = false;
    try {
      pdfPath = await generateOfferLetterPDF({
        studentName: application.fullName,
        email: application.email,
        college: application.college,
        course: application.course,
        internshipRole: application.internshipRole,
        startDate: application.startDate,
        endDate: application.endDate,
        mode: application.mode,
        stipend: application.stipend,
        offerLetterId,
      });

      let pdfBuffer = null;
      if (pdfPath && fs.existsSync(pdfPath)) {
        pdfBuffer = fs.readFileSync(pdfPath);
      }

      await OfferLetter.create({
        applicationId: application._id,
        userId: req.user._id,
        offerLetterId,
        studentName: application.fullName,
        email: application.email,
        phone: application.phone,
        college: application.college,
        course: application.course,
        internshipRole: application.internshipRole,
        startDate: application.startDate,
        endDate: application.endDate,
        mode: application.mode,
        stipend: application.stipend,
        pdfPath,
        pdfBuffer,
      });

      emailSent = await sendOfferLetterEmail(application, pdfPath);
      if (emailSent) {
        application.offerLetterSent = true;
        await application.save();
      }
    } catch (pdfErr) {
      console.error('PDF/Email error:', pdfErr.message);
    }

    res.json({
      success: true,
      message: 'Payment Skipped! Offer Letter generated. 🎉',
      offerLetterId,
      emailSent,
      application: {
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        upiTransactionId: application.upiTransactionId,
        amount: application.amount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Share Offer Letter to a specific email
// @route POST /api/applications/share/:id
// @access Private
exports.shareOfferLetter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const application = await Application.findOne({ _id: req.params.id, userId: req.user._id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const ol = await OfferLetter.findOne({ applicationId: application._id });
    if (!ol || !ol.pdfPath) return res.status(404).json({ success: false, message: 'Offer letter not found' });

    // Temporarily replace application email to send it to the new one
    const appDataForEmail = { ...application.toObject(), email };
    const emailSent = await sendOfferLetterEmail(appDataForEmail, ol.pdfPath);

    if (emailSent) {
      res.json({ success: true, message: `Offer letter shared successfully to ${email}` });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send email' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Confirm UPI QR payment (user provides transaction ID after paying)
// @route POST /api/applications/confirm-upi-payment
// @access Private
exports.confirmUpiPayment = async (req, res) => {
  try {
    const { applicationId, upiTransactionId, upiId } = req.body;

    const utrRegex = /^\d{12}$/;
    if (!upiTransactionId || !utrRegex.test(upiTransactionId.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 12-digit UPI Transaction ID (UTR)' });
    }

    const application = await Application.findOne({ _id: applicationId, userId: req.user._id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.paymentStatus === 'paid' || application.paymentStatus === 'pending_verification') {
      return res.status(400).json({ success: false, message: 'Payment is already processed or under verification' });
    }

    // Check for duplicate transaction ID
    const duplicate = await Application.findOne({ 
      upiTransactionId: upiTransactionId.trim(), 
      paymentStatus: { $in: ['paid', 'pending_verification'] } 
    });
    
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'This UPI Transaction ID has already been used' });
    }

    // Mark as pending verification with UPI details
    application.paymentStatus = 'pending_verification';
    application.paymentMethod = 'upi_qr';
    application.upiTransactionId = upiTransactionId.trim();
    application.upiId = upiId ? upiId.trim() : '';
    application.amount = 199; // or whatever the current amount is

    await application.save();

    // Update ApplicantData (raw data collection) with payment info
    try {
      await ApplicantData.findOneAndUpdate(
        { phone: application.phone },
        { 
          $set: { 
            paymentInfo: {
              upiId: application.upiId,
              upiTransactionId: application.upiTransactionId,
              amount: application.amount,
              status: application.paymentStatus,
              submittedAt: new Date()
            } 
          } 
        }
      );
    } catch (err) {
      console.error('Error updating ApplicantData:', err.message);
    }

    // Log to Excel (CSV)
    savePaymentToCsv(application);

    res.json({
      success: true,
      message: 'Payment details submitted! Verification takes 12-24 hours. Your offer letter will be sent to your email once verified.',
      application: {
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        upiTransactionId: application.upiTransactionId,
        upiId: application.upiId,
        amount: application.amount,
        status: application.paymentStatus
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all applications (Admin)
// @route GET /api/applications/all
// @access Private/Admin
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Export transactions as CSV (Admin)
// @route GET /api/applications/export-transactions
// @access Private/Admin
exports.exportTransactionsCsv = async (req, res) => {
  try {
    const applications = await Application.find({ upiTransactionId: { $exists: true, $ne: '' } }).sort({ createdAt: -1 });
    
    let csvStr = 'FullName,Email,Phone,UPI_ID,Transaction_ID,Amount,Status,Date\n';
    applications.forEach(app => {
      const row = [
        app.fullName || '',
        app.email || '',
        app.phone || '',
        app.upiId || '',
        app.upiTransactionId || '',
        app.amount || 199,
        app.paymentStatus || '',
        new Date(app.createdAt).toISOString()
      ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
      csvStr += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(csvStr);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
