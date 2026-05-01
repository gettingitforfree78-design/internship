const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../secured_not_to_be_pushed/secrets/backend.env') });

const OfferLetter = require('../models/OfferLetter');
const Certificate = require('../models/Certificate');

async function migratePaths() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for path migration');

    // Migrate OfferLetters
    const offerLetters = await OfferLetter.find({});
    console.log(`🔍 Found ${offerLetters.length} offer letters to check...`);
    
    for (let ol of offerLetters) {
      if (ol.pdfPath && ol.pdfPath.includes('\\backend\\uploads\\')) {
        const newPath = ol.pdfPath.replace('\\backend\\uploads\\', '\\secured_not_to_be_pushed\\offer_letters\\');
        ol.pdfPath = newPath;
        await ol.save();
        console.log(`✅ Updated OfferLetter ${ol.offerLetterId}`);
      } else if (ol.pdfPath && ol.pdfPath.includes('/backend/uploads/')) {
        const newPath = ol.pdfPath.replace('/backend/uploads/', '/secured_not_to_be_pushed/offer_letters/');
        ol.pdfPath = newPath;
        await ol.save();
        console.log(`✅ Updated OfferLetter ${ol.offerLetterId}`);
      }
    }

    // Migrate Certificates
    const certificates = await Certificate.find({});
    console.log(`🔍 Found ${certificates.length} certificates to check...`);

    for (let cert of certificates) {
      if (cert.pdfPath && cert.pdfPath.includes('\\backend\\uploads\\')) {
        const newPath = cert.pdfPath.replace('\\backend\\uploads\\', '\\secured_not_to_be_pushed\\certificates\\');
        cert.pdfPath = newPath;
        await cert.save();
        console.log(`✅ Updated Certificate ${cert.certificateId}`);
      } else if (cert.pdfPath && cert.pdfPath.includes('/backend/uploads/')) {
        const newPath = cert.pdfPath.replace('/backend/uploads/', '/secured_not_to_be_pushed/certificates/');
        cert.pdfPath = newPath;
        await cert.save();
        console.log(`✅ Updated Certificate ${cert.certificateId}`);
      }
    }

    console.log('🚀 Path migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migratePaths();
