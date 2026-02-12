const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const { ensureAuth, ensureAdmin } = require('../middleware/auth');

const router = express.Router();
const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/auth/register', ah(authController.register));
router.post('/auth/login', ah(authController.login));
router.post('/auth/logout', authController.logout);
router.get('/auth/me', ah(authController.me));

router.get('/products', ah(productController.listProducts));
router.get('/products/:id', ah(productController.getProduct));
router.post('/products', ensureAdmin, ah(productController.createProduct));
router.patch('/products/:id', ensureAdmin, ah(productController.updateProduct));
router.delete('/products/:id', ensureAdmin, ah(productController.deleteProduct));

router.get('/cart', ensureAuth, ah(cartController.getCart));
router.post('/cart/items', ensureAuth, ah(cartController.addCartItem));
router.patch('/cart/items/:productId', ensureAuth, ah(cartController.updateCartItem));
router.delete('/cart/items/:productId', ensureAuth, ah(cartController.removeCartItem));

router.post('/orders', ensureAuth, ah(orderController.createOrder));
router.get('/orders/my', ensureAuth, ah(orderController.myOrders));
router.get('/orders/summary/top-categories', ensureAuth, ah(orderController.topCategoriesSummary));

router.get('/admin/orders', ensureAdmin, ah(orderController.allOrders));
router.patch('/admin/orders/:id/status', ensureAdmin, ah(orderController.updateOrderStatus));

module.exports = router;
