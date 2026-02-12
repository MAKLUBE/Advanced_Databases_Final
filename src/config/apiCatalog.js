const API_ENDPOINTS = [
  'POST /api/auth/register',
  'POST /api/auth/login',
  'POST /api/auth/logout',
  'GET /api/auth/me',
  'GET /api/products',
  'GET /api/products/:id',
  'POST /api/products',
  'PATCH /api/products/:id',
  'DELETE /api/products/:id',
  'GET /api/cart',
  'POST /api/cart/items',
  'PATCH /api/cart/items/:productId',
  'DELETE /api/cart/items/:productId',
  'POST /api/orders',
  'GET /api/orders/my',
  'GET /api/orders/summary/top-categories',
  'GET /api/admin/orders',
  'PATCH /api/admin/orders/:id/status'
];

const PAGES = [
  '/',
  '/products',
  '/products/:id',
  '/cart',
  '/login',
  '/register',
  '/dashboard',
  '/admin/orders'
];

module.exports = { API_ENDPOINTS, PAGES };
