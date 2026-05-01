const Company = require('../models/Company');

// @desc    Register a company (partner)
// @route   POST /api/companies
// @access  Public
exports.register = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, company, message: 'Partnership request submitted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all companies (Admin)
// @route   GET /api/companies
// @access  Admin
exports.getAll = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update company status (Admin)
// @route   PUT /api/companies/:id
// @access  Admin
exports.updateStatus = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
