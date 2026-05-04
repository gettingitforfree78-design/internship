const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config({ path: '../secured_not_to_be_pushed/secrets/backend.env' });
const OfferLetter = require('../models/OfferLetter');
const Application = require('../models/Application');
const connectDB = require('../config/db');

async function testOfferLetter() {
  await connectDB();
  
  // Find an offer letter that has a pdfBuffer
  const ol = await OfferLetter.findOne({ pdfBuffer: { $exists: true, $ne: null } }).sort({ createdAt: -1 });
  if (!ol) {
    console.log("No offer letter found with pdfBuffer");
    process.exit(0);
  }
  
  console.log(`Found offer letter: ${ol.offerLetterId}`);
  console.log(`pdfBuffer type:`, typeof ol.pdfBuffer);
  console.log(`Is Buffer?`, Buffer.isBuffer(ol.pdfBuffer));
  
  const buf = Buffer.isBuffer(ol.pdfBuffer) ? ol.pdfBuffer : Buffer.from(ol.pdfBuffer);
  console.log(`Buffer length:`, buf.length);
  
  // Save to disk
  fs.writeFileSync('test_local.pdf', buf);
  console.log('Saved to test_local.pdf. Check if it opens!');
  
  // Also check the first few bytes
  console.log('First 10 bytes:', buf.slice(0, 10).toString('utf8'));
  
  process.exit(0);
}

testOfferLetter();
