const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { exec } = require('child_process');
const execPromise = util.promisify(exec);

const generateOfferLetterPDF = async (data) => {
  const {
    studentName, college, course, internshipRole,
    startDate, endDate, mode, stipend, offerLetterId, email, phone
  } = data;

  const uploadsDir = path.join(__dirname, '../../secured_not_to_be_pushed/offer_letters');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const fileName = `offer_letter_${offerLetterId}.pdf`;
  const pdfPath = path.join(uploadsDir, fileName);

  // Read from applicants.json to get the latest data as requested
  let applicantData = {};
  try {
    const applicantsDbPath = path.join(__dirname, '../../secured_not_to_be_pushed/test_real_data/applicants.json');
    if (fs.existsSync(applicantsDbPath)) {
      const allData = JSON.parse(fs.readFileSync(applicantsDbPath, 'utf8'));
      if (phone && allData[phone]) {
        applicantData = allData[phone].rawData || allData[phone];
      }
    }
  } catch (e) {
    console.error('Error reading applicants.json:', e.message);
  }

  // Combine passed data with applicants.json data
  const finalName = applicantData.fullName || studentName;
  const finalRole = applicantData.internshipRole || internshipRole || 'Intern';
  const finalStartDate = applicantData.startDate || startDate || new Date();
  const finalMode = applicantData.mode || mode || 'Remote';

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
  };

  // Prepare JSON for Python script
  const templateData = {
    NAME_OF_PERSON: finalName,
    TODAY_DATE: formatDate(new Date()),
    DESIGNATION: finalRole,
    START_DATE: formatDate(finalStartDate),
    WORK_LOCATION: finalMode
  };

  const jsonPath = path.join(uploadsDir, `data_${offerLetterId}.json`);
  const docxPath = path.join(uploadsDir, `offer_letter_${offerLetterId}.docx`);
  
  fs.writeFileSync(jsonPath, JSON.stringify(templateData, null, 2));

  // Since you moved it to the backend folder:
  const scriptPath = path.join(__dirname, '../fill-offer-letter_changed.js');
  const templatePath = path.join(__dirname, '../../Job_Offer_Letter_Designed-v2.docx');

  try {
    // Attempt to run the Node.js script
    console.log(`Running JS script for offer letter: ${offerLetterId}`);
    const cmd = `node "${scriptPath}" "${templatePath}" "${jsonPath}" "${docxPath}" "${pdfPath}"`;
    await execPromise(cmd);
    
    // Clean up temporary JSON
    if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
    
    // The script catches LibreOffice errors internally and exits with 0. 
    // We MUST check if the PDF was actually created!
    if (fs.existsSync(pdfPath)) {
      return pdfPath;
    }
    
    // If PDF wasn't created, throw error to trigger the PDFKit fallback
    throw new Error('PDF conversion failed, falling back to PDFKit');

    throw new Error('Neither PDF nor DOCX was created by the script.');
  } catch (scriptError) {
    console.warn('⚠️ JS script failed entirely. Falling back to basic PDFKit generator...', scriptError.message);
    
    // Fallback to the original PDFKit generation
    const issuedDate = formatDate(new Date());

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 60 });
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      // ── BORDER ──
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1).stroke('#e2e8f0');
      doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).lineWidth(0.5).stroke('#f1f5f9');

      // ── HEADER BAND ──
      doc.rect(20, 20, doc.page.width - 40, 120).fill('#0f172a');

      // Company Branding
      doc.fontSize(26).fillColor('#ff6b35').font('Helvetica-Bold')
        .text('SHODWE, INC.', 0, 45, { align: 'center' });
      doc.fontSize(10).fillColor('#94a3b8').font('Helvetica')
        .text('POWERING LAUNCHPAD INTENSIVE', 0, 75, { align: 'center', characterSpacing: 1.5 });
      doc.fontSize(8).fillColor('#64748b')
        .text('www.launchpadintensive.com  |  contact@shodwe.com', 0, 95, { align: 'center' });

      // ── TITLE ──
      doc.moveDown(6);
      doc.fontSize(22).fillColor('#0f172a').font('Helvetica-Bold')
        .text('OFFER OF INTERNSHIP', { align: 'center' });

      // Subtle underline
      const titleY = doc.y + 5;
      doc.moveTo(200, titleY).lineTo(doc.page.width - 200, titleY).lineWidth(2).stroke('#ff6b35');

      // ── DATE & ID ──
      doc.moveDown(2);
      doc.fontSize(9).fillColor('#64748b').font('Helvetica');
      doc.text(`REFERENCE ID: ${offerLetterId}`, 60, doc.y, { align: 'left' });
      doc.text(`ISSUED ON: ${issuedDate}`, 60, doc.y + 12, { align: 'left' });

      // ── SALUTATION ──
      doc.moveDown(2.5);
      doc.fontSize(12).fillColor('#1e293b').font('Helvetica-Bold')
        .text(`Dear ${finalName},`, 60);

      doc.moveDown(0.8);
      doc.fontSize(10.5).fillColor('#334155').font('Helvetica')
        .text(
          `We are pleased to offer you an internship opportunity with Shodwe, Inc. (operating as Launchpad Intensive). After a careful review of your application and profile, we believe your skills will be a great addition to our team for the upcoming term.`,
          60, doc.y, { width: doc.page.width - 120, align: 'justify', lineGap: 4 }
        );

      // ── APPOINTMENT DETAILS ──
      doc.moveDown(2);
      doc.fontSize(11).fillColor('#0f172a').font('Helvetica-Bold').text('APPOINTMENT DETAILS', 60);
      
      const tableTop = doc.y + 10;
      const col1 = 60, col2 = 240;
      const rowH = 26;

      const rows = [
        ['POSITION', finalRole.toUpperCase()],
        ['INTERNSHIP MODE', finalMode.toUpperCase()],
        ['START DATE', formatDate(finalStartDate).toUpperCase()],
        ['END DATE', formatDate(endDate).toUpperCase()],
        ['STIPEND / MONTH', stipend.toUpperCase()],
      ];

      rows.forEach((row, i) => {
        const y = tableTop + i * rowH;
        doc.rect(60, y, doc.page.width - 120, rowH).fill(i % 2 === 0 ? '#f8fafc' : '#ffffff');
        doc.fontSize(9).fillColor('#64748b').font('Helvetica-Bold').text(row[0], col1 + 10, y + 8);
        doc.fontSize(9).fillColor('#0f172a').font('Helvetica').text(row[1] || 'N/A', col2, y + 8);
      });

      // ── NEXT STEPS ──
      doc.moveDown(3);
      doc.fontSize(11).fillColor('#0f172a').font('Helvetica-Bold').text('NEXT STEPS', 60);
      doc.fontSize(10).fillColor('#475569').font('Helvetica')
        .text(
          `To accept this offer, please reply to our official email before ${formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000))}. Detailed onboarding instructions will be shared upon acceptance.`,
          60, doc.y + 8, { width: doc.page.width - 120, align: 'justify' }
        );

      // ── SIGNATURES ──
      const sigY = doc.page.height - 180;
      
      // Authorized Signatory
      doc.fontSize(10).fillColor('#0f172a').font('Helvetica-Bold').text('Rananjay Singh', 60, sigY);
      doc.fontSize(9).fillColor('#64748b').font('Helvetica').text('Chief Executive Officer', 60, sigY + 12);
      doc.fontSize(8).fillColor('#94a3b8').font('Helvetica').text('Shodwe, Inc.', 60, sigY + 24);

      // Student Acceptance
      doc.fontSize(10).fillColor('#0f172a').font('Helvetica-Bold').text(finalName, doc.page.width - 200, sigY);
      doc.fontSize(9).fillColor('#64748b').font('Helvetica').text('Intern Candidate', doc.page.width - 200, sigY + 12);
      
      // Signature Lines
      doc.moveTo(60, sigY + 45).lineTo(180, sigY + 45).lineWidth(0.5).stroke('#cbd5e1');
      doc.moveTo(doc.page.width - 200, sigY + 45).lineTo(doc.page.width - 80, sigY + 45).lineWidth(0.5).stroke('#cbd5e1');

      // ── FOOTER ──
      doc.rect(20, doc.page.height - 60, doc.page.width - 40, 40).fill('#0f172a');
      doc.fontSize(8).fillColor('#94a3b8')
        .text('© 2025 SHODWE, INC. | ALL RIGHTS RESERVED | PRIVATE & CONFIDENTIAL', 0, doc.page.height - 42, { align: 'center' });

      doc.end();
      stream.on('finish', () => resolve(pdfPath));
      stream.on('error', reject);
    });
  }
};

module.exports = { generateOfferLetterPDF };
