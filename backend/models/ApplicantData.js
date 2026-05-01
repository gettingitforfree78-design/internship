const mongoose = require('mongoose');

const applicantDataSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  rawData: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ApplicantData', applicantDataSchema);
