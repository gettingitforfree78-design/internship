const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  internshipName: {
    type: String,
    required: true,
  },
  completionDate: {
    type: Date,
    default: Date.now,
  },
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  pdfPath: {
    type: String,
    default: '',
  },
  sentViaEmail: {
    type: Boolean,
    default: false,
  },
  sentAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Certificate', certificateSchema);
