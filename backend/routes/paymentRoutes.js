const router = require('express').Router();
const { createOrder, verifyPayment, getHistory } = require('../controllers/paymentController');
const protect = require('../middleware/auth');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getHistory);

module.exports = router;
