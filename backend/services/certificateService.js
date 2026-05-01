const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateCertificatePDF = async (data) => {
  const { studentName, internshipName, completionDate, certificateId } = data;

  const uploadsDir = path.join(__dirname, '../../secured_not_to_be_pushed/certificates');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `certificate_${certificateId}.pdf`;
  const filePath = path.join(uploadsDir, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 30, bottom: 30, left: 40, right: 40 },
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const pageW = doc.page.width;
    const pageH = doc.page.height;

    // Outer border
    doc.rect(20, 20, pageW - 40, pageH - 40)
      .lineWidth(3)
      .strokeColor('#0A1628')
      .stroke();

    // Inner border
    doc.rect(30, 30, pageW - 60, pageH - 60)
      .lineWidth(1)
      .strokeColor('#FF6B35')
      .stroke();

    // Decorative corners
    const cornerSize = 40;
    // Top-left
    doc.moveTo(35, 35).lineTo(35 + cornerSize, 35).lineWidth(3).strokeColor('#FF6B35').stroke();
    doc.moveTo(35, 35).lineTo(35, 35 + cornerSize).stroke();
    // Top-right
    doc.moveTo(pageW - 35, 35).lineTo(pageW - 35 - cornerSize, 35).stroke();
    doc.moveTo(pageW - 35, 35).lineTo(pageW - 35, 35 + cornerSize).stroke();
    // Bottom-left
    doc.moveTo(35, pageH - 35).lineTo(35 + cornerSize, pageH - 35).stroke();
    doc.moveTo(35, pageH - 35).lineTo(35, pageH - 35 - cornerSize).stroke();
    // Bottom-right
    doc.moveTo(pageW - 35, pageH - 35).lineTo(pageW - 35 - cornerSize, pageH - 35).stroke();
    doc.moveTo(pageW - 35, pageH - 35).lineTo(pageW - 35, pageH - 35 - cornerSize).stroke();

    // Company name
    doc.fontSize(16)
      .fillColor('#FF6B35')
      .font('Helvetica-Bold')
      .text('LAUNCHPAD INTENSIVE PRIVATE LIMITED', 0, 60, { align: 'center' });

    // Certificate title
    doc.moveDown(0.8);
    doc.fontSize(36)
      .fillColor('#0A1628')
      .font('Helvetica-Bold')
      .text('CERTIFICATE', 0, 100, { align: 'center' });

    doc.fontSize(16)
      .fillColor('#2D3F5E')
      .font('Helvetica')
      .text('OF COMPLETION', 0, 142, { align: 'center' });

    // Decorative line
    const lineY = 170;
    doc.moveTo(pageW / 2 - 120, lineY)
      .lineTo(pageW / 2 + 120, lineY)
      .lineWidth(2)
      .strokeColor('#FF6B35')
      .stroke();

    // Award text
    doc.fontSize(13)
      .fillColor('#3E5578')
      .font('Helvetica')
      .text('This is to certify that', 0, 195, { align: 'center' });

    // Student name
    doc.fontSize(30)
      .fillColor('#0A1628')
      .font('Helvetica-Bold')
      .text(studentName, 0, 220, { align: 'center' });

    // Underline for name
    const nameWidth = doc.widthOfString(studentName);
    doc.moveTo((pageW - nameWidth) / 2, 258)
      .lineTo((pageW + nameWidth) / 2, 258)
      .lineWidth(1)
      .strokeColor('#FF6B35')
      .stroke();

    // Description
    doc.fontSize(13)
      .fillColor('#3E5578')
      .font('Helvetica')
      .text(
        `has successfully completed the internship program in`,
        0, 275, { align: 'center' }
      );

    // Internship name
    doc.fontSize(22)
      .fillColor('#FF6B35')
      .font('Helvetica-Bold')
      .text(internshipName, 0, 300, { align: 'center' });

    // Completion details
    const formattedDate = new Date(completionDate).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    doc.fontSize(12)
      .fillColor('#3E5578')
      .font('Helvetica')
      .text(
        `awarded by Launchpad Intensive Private Limited on ${formattedDate}`,
        0, 340, { align: 'center' }
      );

    // Signature area
    const sigY = 400;
    // Left signature
    doc.moveTo(120, sigY).lineTo(300, sigY).lineWidth(1).strokeColor('#0A1628').stroke();
    doc.fontSize(10).fillColor('#3E5578').font('Helvetica')
      .text('Program Director', 120, sigY + 5, { width: 180, align: 'center' });

    // Right signature
    doc.moveTo(pageW - 300, sigY).lineTo(pageW - 120, sigY).lineWidth(1).strokeColor('#0A1628').stroke();
    doc.fontSize(10).fillColor('#3E5578').font('Helvetica')
      .text('CEO, Launchpad Intensive', pageW - 300, sigY + 5, { width: 180, align: 'center' });

    // Certificate ID
    doc.fontSize(8)
      .fillColor('#94A3B8')
      .font('Helvetica')
      .text(`Certificate ID: ${certificateId}`, 0, pageH - 55, { align: 'center' });

    doc.fontSize(7)
      .fillColor('#CBD5E1')
      .text('Verify at: launchpadintensive.com/verify', 0, pageH - 43, { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve({ filePath, fileName }));
    stream.on('error', reject);
  });
};

module.exports = { generateCertificatePDF };
