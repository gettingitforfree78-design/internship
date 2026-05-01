const { v4: uuidv4 } = require('uuid');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const { generateCertificatePDF } = require('../services/certificateService');
const { sendCertificateEmail } = require('../services/emailService');

// @desc    Generate certificate for user
// @route   POST /api/certificate/generate/:userId
// @access  Admin
exports.generate = async (req, res) => {
  try {
    const { userId } = req.params;
    const { internshipId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });

    // Check if certificate already exists
    const existing = await Certificate.findOne({ userId, internshipId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Certificate already generated', certificate: existing });
    }

    const certificateId = `LP-${uuidv4().slice(0, 8).toUpperCase()}`;
    const completionDate = new Date();

    // Generate PDF
    const { filePath, fileName } = await generateCertificatePDF({
      studentName: user.name,
      internshipName: internship.title,
      completionDate,
      certificateId,
    });

    // Save certificate record
    const certificate = await Certificate.create({
      userId,
      internshipId,
      studentName: user.name,
      email: user.email,
      internshipName: internship.title,
      completionDate,
      certificateId,
      pdfPath: filePath,
    });

    // Update application status to completed
    await Application.findOneAndUpdate(
      { userId, internshipId },
      { status: 'completed', progress: 100, endDate: completionDate }
    );

    res.status(201).json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send certificate via email
// @route   POST /api/certificate/send/:userId
// @access  Admin
exports.send = async (req, res) => {
  try {
    const { userId } = req.params;
    const { internshipId } = req.body;

    const certificate = await Certificate.findOne({ userId, internshipId });
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found. Generate it first.' });
    }

    const result = await sendCertificateEmail(
      certificate.email,
      certificate.studentName,
      certificate.internshipName,
      certificate.pdfPath
    );

    if (result.sent) {
      certificate.sentViaEmail = true;
      certificate.sentAt = new Date();
      await certificate.save();
    }

    res.json({ success: true, emailResult: result, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download certificate
// @route   GET /api/certificate/download/:id
// @access  Private
exports.download = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Only owner or admin can download
    if (certificate.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.download(certificate.pdfPath, `${certificate.certificateId}.pdf`);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's certificates
// @route   GET /api/certificate/my
// @access  Private
exports.getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .populate('internshipId', 'title category icon');
    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificate/all
// @access  Admin
exports.getAll = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('userId', 'name email')
      .populate('internshipId', 'title category')
      .sort({ createdAt: -1 });
    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
