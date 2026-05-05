const router = require('express').Router();
const { getHistory } = require('../controllers/paymentController');
const protect = require('../middleware/auth');

router.get('/history', protect, getHistory);

module.exports = router;
