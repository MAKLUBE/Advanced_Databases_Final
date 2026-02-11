const Order = require('../models/Order');

exports.salesByCategory = async (req, res, next) => {
  try {
    const result = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          totalSoldUnits: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$product.price'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json(result);
  } catch (e) { next(e); }
};

exports.topProducts = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit || '5', 10), 1), 50);

    const result = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          sold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          name: '$product.name',
          sold: 1,
          price: '$product.price'
        }
      }
    ]);

    res.json(result);
  } catch (e) { next(e); }
};

exports.monthlyRevenue = async (req, res, next) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(result);
  } catch (e) { next(e); }
};
