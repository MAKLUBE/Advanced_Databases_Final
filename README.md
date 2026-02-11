# Sports Goods Store (MongoDB + REST API + Frontend)

This is a simple **web application** (backend + frontend) using **MongoDB** that demonstrates:
- Full CRUD across multiple collections
- Embedded + referenced data modeling
- Advanced updates ($set, $push, $pull, $inc)
- Aggregation endpoints (multi-stage pipelines)
- Authentication + authorization (session-based)

These points match the course final project requirements (REST API + MongoDB + CRUD + aggregation + auth, etc.). fileciteturn0file0

---

## 1) Requirements
- Node.js (LTS recommended)
- MongoDB running locally (or use a different connection string)

---

## 2) How to run (the quick way)

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm start
```

Backend runs on:
- http://localhost:3000


### Backend environment file
Create `backend/.env` (you can copy from `.env.example`) with:

```env
MONGO_URI=mongodb://127.0.0.1:27017/sports_store
SESSION_SECRET=change-me
PORT=3000
```

### Frontend
Open **frontend** folder with any static server on port **5500** (important because of CORS):

Example:
```bash
cd frontend
npx serve -l 5500
```

Open:
- http://localhost:5500

---

## 3) Demo Accounts (created by seed)
- **Admin:** `admin / admin123`
- **Customer:** `user / user123`

---

## 4) Main Pages
- `index.html` – home
- `login.html` – login
- `register.html` – register (creates customer)
- `products.html` – products list + search
- `orders.html` – admin-only orders list
- `admin.html` – admin analytics demo

---

## 5) API Endpoints (core)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Products
- `GET /api/products` (pagination/filter/search)
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `PATCH /api/products/:id/decrease-stock` (admin)  → `$inc`
- `PATCH /api/products/:id/review` → `$push`
- `PATCH /api/products/:id/review/remove` (admin) → `$pull`

### Categories (admin for write)
- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories` (admin)
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

### Suppliers (admin for write)
- `GET /api/suppliers`
- `GET /api/suppliers/:id`
- `POST /api/suppliers` (admin)
- `PUT /api/suppliers/:id` (admin)
- `DELETE /api/suppliers/:id` (admin)

### Orders
- `POST /api/orders` (auth required)
- `GET /api/orders` (admin)
- `GET /api/orders/:id` (auth required)
- `DELETE /api/orders/:id` (admin)

### Analytics (aggregation)
- `GET /api/analytics/sales-by-category`
- `GET /api/analytics/top-products?limit=5`
- `GET /api/analytics/monthly-revenue`

---

## 6) Notes (Indexes / Optimization)
- `Product` has:
    - compound index `{ category: 1, price: 1 }`
    - text index on `name`
- `Order` has index on `createdAt` and `{ createdAt: 1, user: 1 }`
