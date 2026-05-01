const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../secured_not_to_be_pushed/secrets/backend.env') });
const nodemailer = require('nodemailer');

console.log('📧 Testing Email Config...');
console.log('User:', process.env.EMAIL_USER);
console.log('Host:', process.env.EMAIL_HOST);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Verification failed:', error.message);
  } else {
    console.log('✅ Server is ready to take our messages');
  }
  process.exit(0);
});
