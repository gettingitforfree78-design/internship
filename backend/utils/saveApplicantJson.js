const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../secured_not_to_be_pushed/test_real_data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const jsonFilePath = path.join(dataDir, 'applicants.json');

exports.saveToJsonFile = (phone, data) => {
  try {
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

  } catch (err) {
    console.error('Error saving to JSON file:', err.message);
  }
};
