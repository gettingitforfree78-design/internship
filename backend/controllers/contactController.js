// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    // In production, you'd save to DB or send email to admin
    console.log('📧 Contact form submission:', { name, email, subject, message });

    res.json({ success: true, message: 'Thank you for reaching out! We will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
