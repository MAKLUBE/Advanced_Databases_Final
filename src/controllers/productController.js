const Product = require('../models/Product');

async function listProducts(req, res) {
  const { category, q } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
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
