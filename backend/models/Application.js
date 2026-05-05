const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true },
  college: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  mode: { type: String, enum: ['Remote', 'Onsite'], required: true },
  stipend: { type: String, required: true },
  address: { type: String, default: '' },
  internshipRole: { type: String, default: 'General Internship' },
  paymentStatus: { type: String, enum: ['pending', 'pending_verification', 'paid'], default: 'pending' },
  paymentMethod: { type: String, enum: ['razorpay', 'upi_qr'], default: 'upi_qr' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  upiTransactionId: { type: String },
  upiId: { type: String },
  amount: { type: Number, default: 199 },
  offerLetterSent: { type: Boolean, default: false },
  offerLetterId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
