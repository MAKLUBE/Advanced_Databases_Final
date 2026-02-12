const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

async function createOrder(req, res) {
  const cart = await Cart.findOne({ user: req.session.userId }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  let totalAmount = 0;
  const items = cart.items.map((item) => {
    const unitPrice = item.product.price;
    totalAmount += unitPrice * item.quantity;

    return {
      product: item.product._id,
      nameSnapshot: item.product.name,
      categorySnapshot: item.product.category,
      quantity: item.quantity,
      unitPrice
    };
  });

  const order = await Order.create({
    user: req.session.userId,
    totalAmount,
    items,
    shippingAddress: req.body.shippingAddress || {}
  });

  await Cart.updateOne({ user: req.session.userId }, { $set: { items: [] } });
  res.status(201).json(order);
}

async function myOrders(req, res) {
  const orders = await Order.find({ user: req.session.userId }).sort({ createdAt: -1 });
  res.json(orders);
}

async function topCategoriesSummary(req, res) {
  const summary = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.categorySnapshot',
        totalRevenue: { $sum: { $multiply: ['$items.unitPrice', '$items.quantity'] } },
        totalUnits: { $sum: '$items.quantity' }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $project: { _id: 0, category: '$_id', totalRevenue: 1, totalUnits: 1 } }
  ]);

  res.json(summary);
}

async function allOrders(req, res) {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
}

async function updateOrderStatus(req, res) {
  const allowed = ['placed', 'paid', 'shipped', 'completed', 'cancelled'];
  const { status } = req.body;

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  return res.json(order);
}

module.exports = { createOrder, myOrders, topCategoriesSummary, allOrders, updateOrderStatus };
