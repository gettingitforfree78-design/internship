const { generateOfferLetterPDF } = require('../services/offerLetterService');
const fs = require('fs');

async function testPDF() {
  try {
    const pdfPath = await generateOfferLetterPDF({
      studentName: 'John Doe',
      email: 'john@example.com',
      college: 'MIT',
      course: 'BTech',
      internshipRole: 'Software Developer Intern',
      startDate: '2025-06-01',
      endDate: '2025-08-01',
      mode: 'Remote',
      stipend: '15000',
      offerLetterId: 'LP-TEST-1234',
    });
    
    console.log("PDF created at:", pdfPath);
    console.log("Size:", fs.statSync(pdfPath).size, "bytes");
    
    // Copy it to frontend public folder so I can download it from the dev server to inspect it
    fs.copyFileSync(pdfPath, '../frontend/public/test_pdf_kit.pdf');
    console.log("Copied to frontend/public/test_pdf_kit.pdf for inspection");
    
  } catch (err) {
    console.error("Failed:", err);
  }
}

testPDF();
