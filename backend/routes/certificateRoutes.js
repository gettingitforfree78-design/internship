const router = require('express').Router();
const { generate, send, download, getMyCertificates, getAll } = require('../controllers/certificateController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

router.get('/my', protect, getMyCertificates);
router.get('/all', protect, adminOnly, getAll);
router.get('/download/:id', protect, download);
router.post('/generate/:userId', protect, adminOnly, generate);
router.post('/send/:userId', protect, adminOnly, send);

module.exports = router;
