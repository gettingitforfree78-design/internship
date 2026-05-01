const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Internship title is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  shortDescription: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['digital-marketing', 'web-development', 'business-development', 'data-science', 'graphic-design', 'other'],
  },
  duration: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  originalPrice: {
    type: Number,
    default: 0,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  syllabus: [{
    week: Number,
    title: String,
    topics: [String],
  }],
  features: [String],
  icon: {
    type: String,
    default: '🚀',
  },
  image: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  maxStudents: {
    type: Number,
    default: 100,
  },
  enrolledCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Auto-generate slug
internshipSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Internship', internshipSchema);
