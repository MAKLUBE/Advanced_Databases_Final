const router = require('express').Router();
const controller = require('../controllers/analytics.controller');

router.get('/sales-by-category', controller.salesByCategory);
router.get('/top-products', controller.topProducts);
router.get('/monthly-revenue', controller.monthlyRevenue);

module.exports = router;