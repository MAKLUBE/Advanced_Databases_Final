const express = require('express');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();
const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const isDbDisabled = process.env.SKIP_DB === 'true';

router.get('/', ah(async (req, res) => {
  const featured = isDbDisabled ? [] : await Product.find().limit(6).sort({ createdAt: -1 });
  res.render('pages/home', { featured });
}));

router.get('/products', ah(async (req, res) => {
  const category = req.query.category;
  const sort = req.query.sort || 'newest';
  const page = Number.parseInt(req.query.page || '1', 10);
  const limit = 12;

  if (isDbDisabled) {
    return res.render('pages/products', {
      products: [],
      category,
      sort,
      pagination: { page: 1, pages: 1 }
    });
  }

  const filter = category ? { category } : {};

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 }
  };

  const sortRule = sortMap[sort] || sortMap.newest;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortRule)
      .skip((Math.max(page, 1) - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter)
  ]);

  res.render('pages/products', {
    products,
    category,
    sort,
    pagination: {
      page: Math.max(page, 1),
      pages: Math.max(1, Math.ceil(total / limit))
    }
  });
}));

router.get('/products/:id', ah(async (req, res) => {
  if (isDbDisabled) return res.status(404).render('pages/not-found');

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).render('pages/not-found');
  res.render('pages/product-details', { product });
}));

router.get('/cart', ensureAuth, ah(async (req, res) => {
  if (isDbDisabled) {
    return res.render('pages/cart', { cart: { items: [] }, cartTotal: 0 });
  }

  const cart = await Cart.findOne({ user: req.session.userId }).populate('items.product');

  const safeCart = cart || { items: [] };
  const cartTotal = safeCart.items.reduce((sum, item) => {
    const unit = item.product?.price || 0;
    return sum + unit * item.quantity;
  }, 0);

  res.render('pages/cart', { cart: safeCart, cartTotal });
}));

router.get('/login', (req, res) => res.render('pages/login'));
router.get('/register', (req, res) => res.render('pages/register'));

router.get('/dashboard', ensureAuth, ah(async (req, res) => {
  const orders = isDbDisabled ? [] : await Order.find({ user: req.session.userId }).sort({ createdAt: -1 }).limit(10);
  res.render('pages/dashboard', { orders });
}));

router.get('/admin/orders', ensureAuth, ah(async (req, res) => {
  if (req.session.role !== 'admin') return res.redirect('/dashboard');
  const orders = isDbDisabled ? [] : await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.render('pages/admin-orders', { orders });
}));

module.exports = router;
