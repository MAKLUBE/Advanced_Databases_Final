const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

function getItemProductId(item) {
  if (!item || !item.product) return null;
  return item.product._id ? item.product._id.toString() : item.product.toString();
}

async function getCart(req, res) {
  const cart = await getOrCreateCart(req.session.userId);
  await cart.populate('items.product');
  res.json(cart);
}

async function addCartItem(req, res) {
  const { productId, quantity = 1 } = req.body;
  const parsedQuantity = Number(quantity);

  if (!productId || Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
    return res.status(400).json({ message: 'productId and quantity >= 1 are required' });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const cart = await getOrCreateCart(req.session.userId);
  const existing = cart.items.find((item) => getItemProductId(item) === productId);

  if (existing) {
    existing.quantity += parsedQuantity;
  } else {
    cart.items.push({ product: productId, quantity: parsedQuantity });
  }

  await cart.save();
  await cart.populate('items.product');
  res.status(201).json(cart);
}

async function updateCartItem(req, res) {
  const { quantity } = req.body;
  const parsedQuantity = Number(quantity);

  if (Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
    return res.status(400).json({ message: 'quantity must be >= 1' });
  }

  const cart = await getOrCreateCart(req.session.userId);
  const target = cart.items.find((item) => getItemProductId(item) === req.params.productId);

  if (!target) return res.status(404).json({ message: 'Cart item not found' });

  target.quantity = parsedQuantity;
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
}

async function removeCartItem(req, res) {
  const cart = await getOrCreateCart(req.session.userId);
  const before = cart.items.length;

  cart.items = cart.items.filter((item) => getItemProductId(item) !== req.params.productId);

  if (before === cart.items.length) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
}

module.exports = { getCart, addCartItem, updateCartItem, removeCartItem };