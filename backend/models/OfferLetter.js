const mongoose = require('mongoose');

const offerLetterSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offerLetterId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  college: { type: String },
  course: { type: String },
  internshipRole: { type: String, default: 'General Internship' },
  startDate: { type: Date },
  endDate: { type: Date },
  mode: { type: String },
  stipend: { type: String },
  pdfPath: { type: String },
  pdfBuffer: { type: Buffer },
  emailSent: { type: Boolean, default: false },
  issuedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('OfferLetter', offerLetterSchema);
