
const mongoose = require('mongoose');

module.exports = mongoose.model('Supplier', new mongoose.Schema({
  name: String,
  country: String
}));
