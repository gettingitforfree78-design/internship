const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../secured_not_to_be_pushed/secrets/backend.env' });
const User = require('../models/User');

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const email = process.env.ADMIN_EMAIL || 'admin@launchpad.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@Launchpad2024';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await User.findOneAndUpdate(
      { email: email },
      { 
        password: hashedPassword,
        role: 'admin',
        name: 'Platform Admin'
      },
      { upsert: true, new: true }
    );

    console.log('Admin user updated/created successfully!');
    console.log('Email:', email);
    console.log('Password set to:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

resetAdmin();
