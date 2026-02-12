const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    nameSnapshot: { type: String, required: true },
    categorySnapshot: { type: String, required: true },
    quantity: { type: Number, min: 1, required: true },
    unitPrice: { type: Number, min: 0, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['placed', 'paid', 'shipped', 'completed', 'cancelled'], default: 'placed' },
    totalAmount: { type: Number, required: true, min: 0 },
    items: [orderItemSchema],
    shippingAddress: {
      city: String,
      street: String,
      postalCode: String
    }
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, totalAmount: -1 });

module.exports = mongoose.model('Order', orderSchema);
