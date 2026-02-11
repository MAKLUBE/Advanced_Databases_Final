const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: ['http://localhost:5500'],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/suppliers', require('./routes/supplier.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));

module.exports = app;
