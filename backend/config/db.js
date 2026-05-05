const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed admin user if it doesn't exist
    try {
      const User = require('../models/User');
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@launchpad.com';
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        await User.create({
          name: process.env.ADMIN_NAME || 'Platform Admin',
          email: adminEmail,
          password: process.env.ADMIN_PASSWORD || 'Admin@Launchpad2024',
          phone: '9999999999',
          role: 'admin',
        });
        console.log(`👤 Admin user created: ${adminEmail}`);
      } else {
        console.log(`👤 Admin already exists: ${adminEmail}`);
      }
    } catch (seedErr) {
      console.error('⚠️  Admin seed error (non-fatal):', seedErr.message);
    }

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
