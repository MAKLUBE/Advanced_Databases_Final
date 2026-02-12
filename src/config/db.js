const mongoose = require('mongoose');

async function connectDB() {
  if (process.env.SKIP_DB === 'true') {
    console.warn('SKIP_DB=true -> starting server without MongoDB connection.');
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set. Please configure your .env file.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
}

module.exports = connectDB;
