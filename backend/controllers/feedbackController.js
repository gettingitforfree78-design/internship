const { getTransporter } = require('../config/email');

exports.submitFeedback = async (req, res) => {
  try {
    const { feedback, name, email, phone, type } = req.body;
    
    if (!feedback) {
      return res.status(400).json({ success: false, message: 'Feedback content is required' });
    }

    const transporter = getTransporter();
    if (!transporter) {
      return res.status(500).json({ success: false, message: 'Email service not configured' });
    }

    const mailOptions = {
      from: `"Launchpad Feedback" <${process.env.EMAIL_USER}>`,
      to: 'launchpad7.hr@gmail.com',
      subject: `New Feedback: ${type || 'General'} from ${name || 'User'}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2>New Feedback Received</h2>
          <p><strong>Name:</strong> ${name || 'N/A'}</p>
          <p><strong>Email:</strong> ${email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Type:</strong> ${type || 'General'}</p>
          <hr />
          <p><strong>Feedback:</strong></p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
            ${feedback}
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 20px;">Sent from Launchpad Intensive Platform</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Feedback email sent successfully to launchpad7.hr@gmail.com');

    res.json({ success: true, message: 'Feedback sent successfully! Thank you.' });
  } catch (err) {
    console.error('❌ Feedback error:', err.message);
    if (err.code === 'EAUTH') {
      console.error('Check EMAIL_USER and EMAIL_PASS in backend.env - Authentication failed.');
    }
    res.status(500).json({ success: false, message: 'Failed to send feedback. Please try again later.' });
  }
};
