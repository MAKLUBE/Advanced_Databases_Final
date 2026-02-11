const router = require('express').Router();
const controller = require('../controllers/analytics.controller');
const { requireRole } = require('../middleware/auth');

router.get('/sales-by-category', requireRole('admin'), controller.salesByCategory);
router.get('/top-products', requireRole('admin'), controller.topProducts);
router.get('/monthly-revenue', requireRole('admin'), controller.monthlyRevenue);

module.exports = router;
