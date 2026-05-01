const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Application = require('../models/Application');
const Internship = require('../models/Internship');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { internshipId } = req.body;

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    // Check if already paid
    const existingPayment = await Payment.findOne({
      userId: req.user._id,
      internshipId,
      status: 'paid',
    });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: 'You have already purchased this internship' });
    }

    const options = {
      amount: internship.price * 100, // Razorpay uses paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        internshipId: internship._id.toString(),
        internshipTitle: internship.title,
      },
    };

    const order = await razorpay.orders.create(options);

    // Save payment record
    const payment = await Payment.create({
      userId: req.user._id,
      internshipId,
      amount: internship.price,
      razorpayOrderId: order.id,
      status: 'created',
    });

    res.json({
      success: true,
      order,
      payment,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update payment
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Create or update application
    await Application.findOneAndUpdate(
      { userId: payment.userId, internshipId: payment.internshipId },
      {
        userId: payment.userId,
        internshipId: payment.internshipId,
        status: 'approved',
        startDate: new Date(),
      },
      { upsert: true, new: true }
    );

    // Update enrolled count
    await Internship.findByIdAndUpdate(payment.internshipId, { $inc: { enrolledCount: 1 } });

    res.json({ success: true, message: 'Payment verified successfully', payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payment history
// @route   GET /api/payment/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    // Admin can see all payments
    if (req.user.role === 'admin' && req.query.all === 'true') {
      delete filter.userId;
    }

    const payments = await Payment.find(filter)
      .populate('internshipId', 'title category duration price icon')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
