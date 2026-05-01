const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../secured_not_to_be_pushed/secrets/backend.env') });

const OfferLetter = require('../models/OfferLetter');
const Certificate = require('../models/Certificate');

async function migratePaths() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for path correction');

    const offerLetters = await OfferLetter.find({});
    for (let ol of offerLetters) {
      if (!ol.pdfPath) continue;
      
      let newPath = ol.pdfPath;
      
      // Fix typos if any
      newPath = newPath.replace('secured_not_to_be_pusshed', 'secured_not_to_be_pushed');
      
      // Fix nesting issue
      newPath = newPath.replace(/offer_letters[\\\/]offerletters[\\\/]/, 'offer_letters\\');
      newPath = newPath.replace(/offer_letters[\\\/]offer_letters[\\\/]/, 'offer_letters\\');
      
      if (newPath !== ol.pdfPath) {
        console.log(`🛠️ Fixing path: ${ol.pdfPath} -> ${newPath}`);
        ol.pdfPath = newPath;
        await ol.save();
      }
    }

    const certificates = await Certificate.find({});
    for (let cert of certificates) {
      if (!cert.pdfPath) continue;
      
      let newPath = cert.pdfPath;
      newPath = newPath.replace('secured_not_to_be_pusshed', 'secured_not_to_be_pushed');
      newPath = newPath.replace(/certificates[\\\/]certificates[\\\/]/, 'certificates\\');
      
      if (newPath !== cert.pdfPath) {
        console.log(`🛠️ Fixing path: ${cert.pdfPath} -> ${newPath}`);
        cert.pdfPath = newPath;
        await cert.save();
      }
    }

    console.log('🚀 Path correction complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migratePaths();
