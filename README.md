# sportsGoodsStore (Final Project)

Full-stack web application for a sports goods store with:
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Frontend:** Server-rendered EJS pages
- **Authentication:** **Cookie-based sessions** (`express-session` + `connect-mongo`), not JWT

---

## 1) Project Features vs Requirements

### Pages (8 total)
1. `/` Home
2. `/products` Product catalog
3. `/products/:id` Product details
4. `/cart` Cart
5. `/login` Login
6. `/register` Register
7. `/dashboard` User dashboard
8. `/admin/orders` Admin orders

### REST API Endpoints (18 total)
#### Auth
1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `POST /api/auth/logout`
4. `GET /api/auth/me`

#### Products (CRUD)
5. `GET /api/products`
6. `GET /api/products/:id`
7. `POST /api/products` (admin)
8. `PATCH /api/products/:id` (admin)
9. `DELETE /api/products/:id` (admin)

#### Cart
10. `GET /api/cart`
11. `POST /api/cart/items`
12. `PATCH /api/cart/items/:productId`
13. `DELETE /api/cart/items/:productId`

#### Orders
14. `POST /api/orders`
15. `GET /api/orders/my`
16. `GET /api/orders/summary/top-categories` (aggregation)

#### Admin
17. `GET /api/admin/orders`
18. `PATCH /api/admin/orders/:id/status`

---

## 2) Data Model (MongoDB)

### Collections
- `users`
- `products`
- `carts`
- `orders`
- `sessions` (created automatically by `connect-mongo`)

### Embedded + referenced examples
- `orders.items[]` is embedded snapshot order data.
- `orders.user` references `users`.
- `carts.items[].product` references `products`.

### Indexes
- `products`: `{ category: 1, subCategory: 1, price: 1 }`, text index on `name` + `description`
- `orders`: `{ user: 1, createdAt: -1 }`, `{ status: 1, totalAmount: -1 }`

---

## 3) How Session Authentication Works

1. User logs in at `POST /api/auth/login`
2. Server validates credentials
3. Server sets session data in `req.session` (`userId`, `role`)
4. Session is saved in MongoDB `sessions` collection
5. Browser stores `connect.sid` cookie
6. Next requests use cookie automatically for authentication

---

## 4) Quick Start

## Prerequisites
- Node.js 18+
- MongoDB local server (or MongoDB Atlas URI)

## Installation
```bash
npm install
cp .env.example .env
```

Edit `.env` if needed.

### Run seeded data + admin user
```bash
npm run seed
```
Creates products and admin account from `.env`:
- `ADMIN_EMAIL=admin@sportsgoods.local`
- `ADMIN_PASSWORD=Admin123!`

### Start development server
```bash
npm run dev
```
Open: `http://localhost:3000`

### Production start
```bash
npm start
```

---

## 5) MongoDB Compass Setup Guide

1. Open **MongoDB Compass**
2. Click **New Connection**
3. Use connection string:
   - local: `mongodb://127.0.0.1:27017`
4. Connect
5. Create database:
   - **Database Name:** `sportsGoodsStore`
   - You can create first collection as `users` (others will appear automatically)
6. Run seed script:
   ```bash
   npm run seed
   ```
7. Refresh Compass and verify collections:
   - `users`, `products`, `carts`, `orders`, `sessions`

### What to create manually in Compass (minimum)
- Database: `sportsGoodsStore`
- Optional first collection: `users`

Everything else is created by app logic and seed script.

---

## 6) Example API Requests

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Student",
  "email": "student@example.com",
  "password": "Pass12345"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "Pass12345"
}
```

### Create product (admin only)
```http
POST /api/products
Content-Type: application/json

{
  "name": "Resistance Band Set",
  "category": "training",
  "subCategory": "Resistance bands",
  "price": 30,
  "stock": 20
}
```

### Aggregation endpoint
```http
GET /api/orders/summary/top-categories
```
Returns revenue/units grouped by category.

---

## 7) Project Structure

```text
src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  models/
  routes/
  scripts/
  views/
  public/
```

---

## 8) Notes

- If you want to run UI without MongoDB (demo only), set:
  - `SKIP_DB=true`
- For real final project defense, keep `SKIP_DB=false`.

