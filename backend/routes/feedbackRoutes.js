const router = require('express').Router();
const { submitFeedback } = require('../controllers/feedbackController');
const protect = require('../middleware/auth');

router.post('/', protect, submitFeedback);

module.exports = router;
