const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['sportswear', 'training', 'recovery', 'nutrition'],
      required: true
    },
    sportType: {
      type: String,
      enum: ['MMA', 'Boxing', 'Wrestling', 'Football', 'Basketball', 'Hockey', null],
      default: null
    },
    subCategory: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '' },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

productSchema.index({ category: 1, subCategory: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
