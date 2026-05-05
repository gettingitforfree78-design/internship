const router = require('express').Router();
const {
  submitApplication,
  getMyApplications, downloadOfferLetter, getAllApplications,
  confirmUpiPayment, skipPayment, shareOfferLetter
} = require('../controllers/applicationController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');


router.post('/', protect, submitApplication);
router.post('/confirm-upi-payment', protect, confirmUpiPayment);
router.post('/skip-payment', protect, skipPayment);
router.post('/share/:id', protect, shareOfferLetter);
router.get('/my', protect, getMyApplications);
router.get('/download/:id', protect, downloadOfferLetter);
router.get('/all', protect, adminOnly, getAllApplications);

module.exports = router;


