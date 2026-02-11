const router = require('express').Router();
const controller = require('../controllers/order.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/', requireAuth, controller.createOrder);
router.get('/', requireRole('admin'), controller.getAllOrders);
router.get('/:id', requireAuth, controller.getOrderById);
router.delete('/:id', requireRole('admin'), controller.deleteOrder);

module.exports = router;
