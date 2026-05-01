const router = require('express').Router();
const { getProfile, updateProfile, getAllUsers, deleteUser, getStats } = require('../controllers/userController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/all', protect, adminOnly, getAllUsers);
router.get('/stats', protect, adminOnly, getStats);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
