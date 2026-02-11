require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/sports_store';

const User = require('../models/User');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const Order = require('../models/Order');

async function main() {
  await mongoose.connect(MONGO_URI);

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Supplier.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({})
  ]);

  const [admin, customer] = await User.create([
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user', password: 'user123', role: 'customer' }
  ]);

  const [shoes, apparel, equipment] = await Category.create([
    { name: 'Shoes' },
    { name: 'Apparel' },
    { name: 'Equipment' }
  ]);

  const [nike, adidas, puma] = await Supplier.create([
    { name: 'Nike', country: 'USA' },
    { name: 'Adidas', country: 'Germany' },
    { name: 'Puma', country: 'Germany' }
  ]);

  const products = await Product.create([
    { name: 'Air Runner', price: 120, stock: 20, category: shoes._id, supplier: nike._id, reviews: [] },
    { name: 'Street Sneaker', price: 90, stock: 15, category: shoes._id, supplier: adidas._id, reviews: [] },
    { name: 'Training T-Shirt', price: 25, stock: 50, category: apparel._id, supplier: puma._id, reviews: [] },
    { name: 'Boxing Gloves', price: 60, stock: 10, category: equipment._id, supplier: nike._id, reviews: [] }
  ]);

  await Order.create([
    {
      user: customer._id,
      items: [
        { product: products[0]._id, quantity: 2 },
        { product: products[2]._id, quantity: 1 }
      ],
      total: 2 * products[0].price + products[2].price
    },
    {
      user: customer._id,
      items: [
        { product: products[1]._id, quantity: 1 },
        { product: products[3]._id, quantity: 1 }
      ],
      total: products[1].price + products[3].price
    }
  ]);

  console.log('✅ Seed complete.');
  console.log('Login: admin / admin123 (role=admin)');
  console.log('Login: user / user123 (role=customer)');

  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect errors
  }
  process.exit(1);
});
