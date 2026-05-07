const { getTransporter } = require('../config/email');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    console.log('📧 Contact form submission:', { name, email, subject, message });

    const transporter = getTransporter();
    if (transporter) {
      const mailOptions = {
        from: `"Launchpad Contact" <${process.env.EMAIL_USER}>`,
        to: 'launchpad7.hr@gmail.com',
        replyTo: email,
        subject: `Contact Form: ${subject || 'General Enquiry'} from ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
              ${message}
            </div>
            <p style="font-size: 12px; color: #64748b; margin-top: 20px;">Sent from Launchpad Intensive Platform</p>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log('✅ Contact email sent successfully to launchpad7.hr@gmail.com');
    }

    res.json({ success: true, message: 'Thank you for reaching out! We will get back to you soon.' });
  } catch (error) {
    console.error('❌ Contact form error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

