const { getTransporter } = require('../config/email');
const path = require('path');

const sendCertificateEmail = async (to, studentName, internshipName, pdfPath) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn('⚠️  Email not sent: transporter not configured');
    return { sent: false, reason: 'Email credentials not configured' };
  }

  const mailOptions = {
    from: `"Launchpad Intensive" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject: '🎉 Congratulations! Your Internship Certificate - Launchpad Intensive',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0A1628; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #FF6B35, #FF8C5A); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Launchpad Intensive</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Private Limited</p>
        </div>
        <div style="padding: 40px 30px; color: #E2E8F0;">
          <h2 style="color: #FF6B35; margin-top: 0;">Congratulations, ${studentName}! 🎉</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            We are delighted to inform you that you have successfully completed the 
            <strong style="color: #FF6B35;">${internshipName}</strong> internship program 
            at Launchpad Intensive Private Limited.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Your certificate of completion is attached to this email. You can also download it 
            from your student dashboard at any time.
          </p>
          <div style="background: rgba(255,107,53,0.1); border-left: 4px solid #FF6B35; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; color: #FFAD80;">
              💡 <strong>Pro Tip:</strong> Add this certificate to your LinkedIn profile to 
              showcase your new skills to potential employers!
            </p>
          </div>
          <p style="font-size: 14px; color: #94A3B8;">
            Keep learning, keep growing. We're proud to have been part of your journey.
          </p>
        </div>
        <div style="background: #1B2845; padding: 20px 30px; text-align: center;">
          <p style="color: #64748B; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Launchpad Intensive Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    `,
    attachments: pdfPath ? [
      {
        filename: path.basename(pdfPath),
        path: pdfPath,
        contentType: 'application/pdf',
      },
    ] : [],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Certificate email sent to ${to}: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email send error: ${error.message}`);
    return { sent: false, reason: error.message };
  }
};

module.exports = { sendCertificateEmail };
