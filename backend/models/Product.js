const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true, index: true },
  reviews: [{ user: String, rating: { type: Number, min: 1, max: 5 } }]
});

ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
