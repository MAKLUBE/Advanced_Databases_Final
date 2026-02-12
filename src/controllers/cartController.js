const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

async function getCart(req, res) {
  const cart = await getOrCreateCart(req.session.userId);
  await cart.populate('items.product');
  res.json(cart);
}

async function addCartItem(req, res) {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const cart = await getOrCreateCart(req.session.userId);
  const existing = cart.items.find((item) => item.product.toString() === productId);

  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }

  await cart.save();
  await cart.populate('items.product');
  res.status(201).json(cart);
}

async function updateCartItem(req, res) {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.session.userId);

  const target = cart.items.find((item) => item.product.toString() === req.params.productId);
  if (!target) return res.status(404).json({ message: 'Cart item not found' });

  target.quantity = Number(quantity);
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
}

async function removeCartItem(req, res) {
  const cart = await getOrCreateCart(req.session.userId);
  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
}

module.exports = { getCart, addCartItem, updateCartItem, removeCartItem };
