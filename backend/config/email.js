const nodemailer = require('nodemailer');

let transporter = null;

const createTransporter = () => {
  console.log('📧 Attempting to create email transporter...');
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email credentials not configured. EMAIL_USER:', process.env.EMAIL_USER, 'EMAIL_PASS:', process.env.EMAIL_PASS ? '****' : 'MISSING');
    return null;
  }
  console.log('✅ Email credentials found. Using:', process.env.EMAIL_USER);

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

const getTransporter = () => {
  if (!transporter) {
    return createTransporter();
  }
  return transporter;
};

module.exports = { createTransporter, getTransporter };
