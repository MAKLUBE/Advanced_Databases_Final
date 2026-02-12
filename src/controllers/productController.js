const Product = require('../models/Product');

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return fallback;
  return parsed;
}

async function listProducts(req, res) {
  const { category, q, sort = 'newest', page = '1', limit = '12', minPrice, maxPrice } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const pageNumber = parsePositiveInt(page, 1);
  const limitNumber = parsePositiveInt(limit, 12);

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
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),
    Product.countDocuments(filter)
  ]);

  res.json({
    data: products,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.max(1, Math.ceil(total / limitNumber))
    }
  });
}

async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json(product);
}

async function createProduct(req, res) {
  const product = await Product.create(req.body);
  return res.status(201).json(product);
}

async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json(product);
}

async function deleteProduct(req, res) {
  const result = await Product.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: 'Product not found' });
  return res.json({ message: 'Product deleted' });
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
