require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

if (!mongoUri) {
  console.error('Missing MongoDB connection string. Set MONGO_URI in backend/.env');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log('API running');
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
