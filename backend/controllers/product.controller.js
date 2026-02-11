const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (e) { next(e); }
};

exports.getAllProducts = async (req, res, next) => {
  try {

    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), 200);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.supplier) filter.supplier = req.query.supplier;
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.q) filter.$text = { $search: req.query.q };

    const sort = {};
    const sortBy = (req.query.sortBy || 'name').toString();
    const sortDir = (req.query.sortDir || 'asc').toString() === 'desc' ? -1 : 1;
    sort[sortBy] = sortDir;

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).populate('category supplier'),
      Product.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total });
  } catch (e) { next(e); }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category supplier');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) { next(e); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) { next(e); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (e) { next(e); }
};

exports.decreaseStock = async (req, res, next) => {
  try {
    const amount = Math.max(parseInt(req.body.amount || '1', 10), 1);
    const product = await Product.findOneAndUpdate(
        { _id: req.params.id, stock: { $gte: amount } },
        { $inc: { stock: -amount } },
        { new: true }
    );
    if (!product) return res.status(400).json({ message: 'Not enough stock or product not found' });
    res.json(product);
  } catch (e) { next(e); }
};

exports.addReview = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $push: { reviews: req.body } },
        { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) { next(e); }
};

exports.removeReview = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $pull: { reviews: { user: req.body.user } } },
        { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) { next(e); }
};
