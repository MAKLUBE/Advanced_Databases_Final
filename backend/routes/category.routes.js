const router = require('express').Router();
const controller = require('../controllers/category.controller');
const { requireRole } = require('../middleware/auth');

router.post('/', requireRole('admin'), controller.createCategory);
router.get('/', controller.getAllCategories);
router.get('/:id', controller.getCategoryById);
router.put('/:id', requireRole('admin'), controller.updateCategory);
router.delete('/:id', requireRole('admin'), controller.deleteCategory);

module.exports = router;
