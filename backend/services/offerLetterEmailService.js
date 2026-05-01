const { getTransporter } = require('../config/email');
const path = require('path');

const sendOfferLetterEmail = async (application, pdfPath) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('⚠️  Email not configured — skipping offer letter email');
    return false;
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const todayDate = formatDate(new Date());
  
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 2);
  const acceptBeforeDate = formatDate(futureDate);

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <!-- Header -->
      <div style="background-color: #0f172a; padding: 24px; text-align: center;">
        <h1 style="color: #ff6b35; margin: 0; font-size: 24px; letter-spacing: 1px;">LAUNCHPAD</h1>
        <p style="color: #94a3b8; margin: 4px 0 0; font-size: 12px; text-transform: uppercase;">Intensive Private Limited</p>
      </div>

      <!-- Body -->
      <div style="padding: 30px 20px;">
        <h2 style="font-size: 20px; color: #0f172a; margin-top: 0;">Congratulations, ${application.fullName}! 🎉</h2>
        <p style="font-size: 15px; color: #475569; line-height: 1.6;">We are excited to offer you the position of <strong>${application.internshipRole}</strong> at Shodwe, Inc. (Launchpad Intensive).</p>

        <!-- Summary Card -->
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #f1f5f9;">
          <h3 style="margin-top: 0; font-size: 14px; color: #ff6b35; text-transform: uppercase; letter-spacing: 0.5px;">Offer Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Start Date:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatDate(application.startDate)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Location:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${application.mode}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Stipend:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #10b981;">${application.stipend}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; color: #475569;">Please review and accept this offer by replying to this email before <strong>${acceptBeforeDate}</strong>.</p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #0f172a;">
          Best Regards,<br>
          <strong>Rananjay Singh</strong><br>
          <span style="color: #64748b; font-size: 12px;">CEO, Launchpad Intensive</span>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">The official Offer Letter PDF is attached to this email.</p>
      </div>
    </div>
  `;

  const ext = path.extname(pdfPath) || '.pdf';
  
  const mailOptions = {
    from: `"Launchpad Intensive" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: application.email,
    subject: '🎉 Congratulations! Your Internship Offer Letter — Shodwe, Inc.',
    html: htmlContent,
    attachments: [{
      filename: `Offer_Letter_${application.fullName.replace(/\s+/g, '_')}${ext}`,
      path: pdfPath,
      contentType: ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf',
    }],
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('⚠️ Failed to send email via Nodemailer:', error.message);
    return false;
  }
};

module.exports = { sendOfferLetterEmail };
