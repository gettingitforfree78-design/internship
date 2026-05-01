const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/internshipController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', protect, adminOnly, create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
