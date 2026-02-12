const express = require('express');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();
const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', ah(async (req, res) => {
  const featured = await Product.find().limit(6).sort({ createdAt: -1 });
  res.render('pages/home', { featured });
}));

router.get('/products', ah(async (req, res) => {
  const category = req.query.category;
  const filter = category ? { category } : {};
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.render('pages/products', { products, category });
}));

router.get('/products/:id', ah(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).render('pages/not-found');
  res.render('pages/product-details', { product });
}));

router.get('/cart', ensureAuth, ah(async (req, res) => {
  const cart = await Cart.findOne({ user: req.session.userId }).populate('items.product');
  res.render('pages/cart', { cart: cart || { items: [] } });
}));

router.get('/login', (req, res) => res.render('pages/login'));
router.get('/register', (req, res) => res.render('pages/register'));

router.get('/dashboard', ensureAuth, ah(async (req, res) => {
  const orders = await Order.find({ user: req.session.userId }).sort({ createdAt: -1 }).limit(10);
  res.render('pages/dashboard', { orders });
}));

router.get('/admin/orders', ensureAuth, ah(async (req, res) => {
  if (req.session.role !== 'admin') return res.redirect('/dashboard');
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.render('pages/admin-orders', { orders });
}));

module.exports = router;
