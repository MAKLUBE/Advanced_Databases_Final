require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const products = [
  { name: 'MMA Compression Shirt', category: 'sportswear', sportType: 'MMA', subCategory: 'Combat sports', price: 35, stock: 40, description: 'Breathable shirt for MMA training.' },
  { name: 'Boxing Gloves Pro', category: 'training', sportType: 'Boxing', subCategory: 'Gloves', price: 60, stock: 25, description: 'Shock-absorbing boxing gloves.' },
  { name: 'Football Jersey', category: 'sportswear', sportType: 'Football', subCategory: 'Team sports', price: 45, stock: 50, description: 'Moisture-wicking football jersey.' },
  { name: 'Adjustable Dumbbells Set', category: 'training', subCategory: 'Dumbbells', price: 160, stock: 15, description: 'Space-saving home gym dumbbells.' },
  { name: 'Massage Gun X2', category: 'recovery', subCategory: 'Massage guns', price: 110, stock: 20, description: 'Deep tissue percussion massage device.' },
  { name: 'Knee Support Brace', category: 'recovery', subCategory: 'Braces', price: 22, stock: 70, description: 'Compression brace for stability.' },
  { name: 'Whey Protein 2kg', category: 'nutrition', subCategory: 'Protein powders', price: 75, stock: 30, description: 'Recovery and muscle support protein.' },
  { name: 'Electrolyte Recovery Drink', category: 'nutrition', subCategory: 'Recovery drinks', price: 12, stock: 90, description: 'Hydration and electrolyte replenishment.' }
];

async function run() {
  await connectDB();

  await Product.deleteMany({});
  await Product.insertMany(products);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sportsgoods.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const passwordHash = await User.hashPassword(adminPassword);
  await User.updateOne(
    { email: adminEmail },
    { $set: { name: 'Admin', role: 'admin', passwordHash }, $setOnInsert: { email: adminEmail } },
    { upsert: true }
  );

  console.log('Seed completed.');
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
