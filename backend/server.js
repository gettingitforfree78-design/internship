const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const envPath = path.join(__dirname, '../secured_not_to_be_pushed/secrets/backend.env');

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('📂 Loading .env from local secured path');
} else {
  require('dotenv').config();
  console.log('🌐 Using system environment variables (Production)');
}
console.log('📧 Email User:', process.env.EMAIL_USER ? 'Configured ✅' : 'NOT FOUND ❌');

const connectDB = require('./config/db');
const { createTransporter } = require('./config/email');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const companyRoutes = require('./routes/companyRoutes');
const contactRoutes = require('./routes/contactRoutes');
const applicationRoutes = require('./routes/applicationRoutes');


const app = express();

// Connect to MongoDB
connectDB();

// Initialize email transporter
createTransporter();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
});
app.use('/api/auth', authLimiter);

// Static files (certificates, uploads)
app.use('/uploads/offerletters', express.static(path.join(__dirname, '../secured_not_to_be_pushed/offer_letters')));
app.use('/uploads/certificates', express.static(path.join(__dirname, '../secured_not_to_be_pushed/certificates')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/applications', applicationRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Launchpad API is running 🚀' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Launchpad API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
