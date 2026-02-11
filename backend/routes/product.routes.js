const router = require('express').Router();
const controller = require('../controllers/product.controller');
const { requireRole } = require('../middleware/auth');

router.post('/', requireRole('admin'), controller.createProduct);
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);
router.put('/:id', requireRole('admin'), controller.updateProduct);
router.delete('/:id', requireRole('admin'), controller.deleteProduct);

router.patch('/:id/decrease-stock', requireRole('admin'), controller.decreaseStock);
router.patch('/:id/review', controller.addReview);
router.patch('/:id/review/remove', requireRole('admin'), controller.removeReview);

module.exports = router;
