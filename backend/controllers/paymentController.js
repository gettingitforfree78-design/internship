// NOTE: Razorpay has been removed in favor of manual UPI verification flow.
// Order creation and verification functions have been disabled.

// @desc    Get payment history (Historical Razorpay records + Manual UPI)
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
