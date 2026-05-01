const router = require('express').Router();
const { register, getAll, updateStatus } = require('../controllers/companyController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

router.post('/', register);
router.get('/', protect, adminOnly, getAll);
router.put('/:id', protect, adminOnly, updateStatus);

module.exports = router;
