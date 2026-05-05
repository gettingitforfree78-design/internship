const fs = require('fs');
const path = require('path');

const getDataDir = () => {
  const dir = path.resolve(process.cwd(), 'secured_not_to_be_pushed/test_real_data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

exports.saveToJsonFile = (phone, data) => {
  try {
    const dataDir = getDataDir();
    const jsonFilePath = path.join(dataDir, 'applicants.json');
    let existingData = {};
    if (fs.existsSync(jsonFilePath)) {
      const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
      if (fileContent.trim()) {
        existingData = JSON.parse(fileContent);
      }
    }
    
    // Use the phone number as the unique key in the main applicants.json
    existingData[phone] = {
      ...data,
      _savedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2));

    // ALSO: Save the absolute latest applicant to a dedicated curr_user.json file
    const currUserPath = path.join(dataDir, 'curr_user.json');
    const currUserData = {
      ...data,
      phone: phone,
      _savedAt: new Date().toISOString()
    };
    fs.writeFileSync(currUserPath, JSON.stringify(currUserData, null, 2));

    // ─── CSV (Excel) Export ────────────────────────────────────────────────
    const csvFilePath = path.join(dataDir, 'applicants.csv');
    const headers = ['FullName', 'Email', 'Phone', 'College', 'Course', 'Role', 'StartDate', 'EndDate', 'Mode', 'Stipend', 'Address', 'Timestamp'];
    
    let csvRow = [
      data.fullName || '',
      data.email || '',
      phone || '',
      data.college || '',
      data.course || '',
      data.internshipRole || '',
      data.startDate || '',
      data.endDate || '',
      data.mode || '',
      data.stipend || '',
      data.address || '',
      new Date().toISOString()
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');

    if (!fs.existsSync(csvFilePath)) {
      fs.writeFileSync(csvFilePath, headers.join(',') + '\n' + csvRow + '\n');
    } else {
      fs.appendFileSync(csvFilePath, csvRow + '\n');
    }

  } catch (err) {
    console.error('Error saving to JSON/CSV files:', err.message);
  }
};

exports.savePaymentToCsv = (application) => {
  try {
    const dataDir = getDataDir();
    const csvFilePath = path.join(dataDir, 'payments_verification.csv');
    const headers = ['FullName', 'Email', 'Phone', 'UPI_ID', 'Transaction_ID', 'Amount', 'Status', 'Timestamp'];
    
    let csvRow = [
      application.fullName || '',
      application.email || '',
      application.phone || '',
      application.upiId || '',
      application.upiTransactionId || '',
      application.amount || '',
      application.paymentStatus || '',
      new Date().toISOString()
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');

    if (!fs.existsSync(csvFilePath)) {
      fs.writeFileSync(csvFilePath, headers.join(',') + '\n' + csvRow + '\n');
    } else {
      fs.appendFileSync(csvFilePath, csvRow + '\n');
    }
  } catch (err) {
    console.error('Error saving payment to CSV:', err.message);
  }
};
