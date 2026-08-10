# Express Backend with Prisma 7 (E-Commerce / Marketplace API) 🚀

A modern, high-performance RESTful API built with **Express 5**, **Prisma 7 ORM**, **PostgreSQL**, and **TypeScript**, deployed as Serverless Functions on **Vercel**.

---

## 🌐 Live Production URL

- **Base URL:** `https://express-backend-with-prisma.vercel.app`
- **Health Check:** `https://express-backend-with-prisma.vercel.app/`

---

## ✨ Features & Architecture

- **Authentication & Security**: JWT-based authentication with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Separate permissions for `ADMIN` and `USER` roles.
- **Resource Management**:
  - **Auth**: User registration and login.
  - **Users**: Admin user management, role updates, soft deletion.
  - **Categories**: Product categorization with soft deletion.
  - **Products**: Stock management, status tracking (`ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`), price updates.
  - **Orders**: Order processing (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`), stock validation, total price calculation.
  - **Reviews**: Product rating and feedback system.
- **Data Integrity**: Soft deletion flag (`isDeleted`) across models to preserve historical records.
- **Serverless Ready**: Configured for instant deployment on Vercel with single-entry routing.

---

## 🛠️ Tech Stack

- **Runtime & Framework:** Node.js (ES Modules), Express.js 5
- **ORM & Database:** Prisma 7 (`@prisma/adapter-pg` driver adapter) + PostgreSQL (Neon)
- **Language:** TypeScript
- **Authentication:** JSON Web Token (`jsonwebtoken`), `bcrypt`
- **Deployment Platform:** Vercel

---

## 🔑 Pre-Seeded Demo Credentials for Testing

You can use these pre-seeded accounts to test authentication and role-protected endpoints right away:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@example.com` | `Admin@123456` | Full access (Create/Update/Delete Categories, Products, Users) |
| **USER** | `john@example.com` | `User@123456` | Customer access (Create Orders, Write Reviews, View Profile) |
| **USER** | `jane@example.com` | `User@123456` | Customer access (Create Orders, Write Reviews, View Profile) |

---

## 📡 API Endpoints Overview

All API responses follow a consistent JSON structure:

```json
{
  "success": true,
  "message": "Human readable summary",
  "data": {}
}
```

### 🔓 Public Endpoints
- `GET /` — Server status health check
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login and obtain JWT Token
- `GET /api/categories` — List all active categories
- `GET /api/products` — List all active products (supports category filtering)
- `GET /api/products/:id` — Get product by ID
- `GET /api/reviews/product/:productId` — Get all reviews for a product

### 🔒 User Protected Endpoints (`Authorization: Bearer <token>`)
- `GET /api/users/me` — View current logged-in user profile
- `POST /api/orders` — Create a new order
- `GET /api/orders/my-orders` — View orders placed by the current user
- `POST /api/reviews` — Write a product review

### 🛡️ Admin Protected Endpoints (`Authorization: Bearer <token>`)
- `GET /api/users` — List all registered users
- `PATCH /api/users/:id/role` — Update a user's role (`ADMIN` / `USER`)
- `DELETE /api/users/:id` — Soft delete a user account
- `POST /api/categories` — Create a new product category
- `PUT /api/categories/:id` — Update a category name
- `DELETE /api/categories/:id` — Soft delete a category
- `POST /api/products` — Add a new product
- `PUT /api/products/:id` — Update a product details/stock/status
- `DELETE /api/products/:id` — Soft delete a product
- `GET /api/orders` — View all orders in system
- `PATCH /api/orders/:id/status` — Update order status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`)

---

## 🧪 Demo Examples & Testing Guide

Below are ready-to-use **cURL commands** and sample payloads to test the API directly against the live Vercel deployment or locally.

### 1. Health Check
```bash
curl -i https://express-backend-with-prisma.vercel.app/
```
**Response:**
```html
Server is running successfully and Prisma is connected! 🚀
```

---

### 2. User Login (Obtain Token)
```bash
curl -i -X POST https://express-backend-with-prisma.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "User@123456"
  }'
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "john-user-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Fetch All Products (With Demo Data)
```bash
curl -i https://express-backend-with-prisma.vercel.app/api/products
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "6e5e6bed-4604-4bd0-9e3b-e25e79850e99",
      "name": "Wireless Noise-Canceling Headphones",
      "description": "Premium over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.",
      "price": 199.99,
      "stock": 50,
      "status": "ACTIVE",
      "categoryId": "763eb46c-215a-4a82-8afb-1a2178814a5a",
      "category": {
        "id": "763eb46c-215a-4a82-8afb-1a2178814a5a",
        "name": "Electronics"
      }
    },
    {
      "id": "952c6bea-534f-462b-840e-53edb562da41",
      "name": "Mechanical RGB Gaming Keyboard",
      "description": "Hot-swappable mechanical keyboard with custom RGB backlighting.",
      "price": 129.5,
      "stock": 30,
      "status": "ACTIVE",
      "categoryId": "763eb46c-215a-4a82-8afb-1a2178814a5a"
    }
  ]
}
```

---

### 4. Fetch All Categories
```bash
curl -i https://express-backend-with-prisma.vercel.app/api/categories
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    { "id": "763eb46c-215a-4a82-8afb-1a2178814a5a", "name": "Electronics" },
    { "id": "8c9d3226-222b-4e21-98ba-261d7b7ae81d", "name": "Fashion & Apparel" },
    { "id": "1a14af98-096e-4a8e-8ff6-df945890f9a8", "name": "Home & Living" },
    { "id": "c842cf45-5b1a-4200-8b53-4d542fa5c28b", "name": "Books & Stationery" }
  ]
}
```

---

### 5. Create a New Order (Requires Token)
Replace `<YOUR_JWT_TOKEN>` with the token from Step 2:
```bash
curl -i -X POST https://express-backend-with-prisma.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "productId": "6e5e6bed-4604-4bd0-9e3b-e25e79850e99",
    "quantity": 2
  }'
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order-uuid",
    "userId": "john-user-uuid",
    "productId": "6e5e6bed-4604-4bd0-9e3b-e25e79850e99",
    "quantity": 2,
    "totalPrice": 399.98,
    "status": "PENDING",
    "createdAt": "2026-08-10T04:38:00.000Z"
  }
}
```

---

### 6. Create a Product Review (Requires Token)
```bash
curl -i -X POST https://express-backend-with-prisma.vercel.app/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "productId": "6e5e6bed-4604-4bd0-9e3b-e25e79850e99",
    "rating": 5,
    "comment": "Absolutely love the battery life and sound quality!"
  }'
```

---

## 💻 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/tanvirislam06408/express-backend-with-prisma.git
cd express-backend-with-prisma
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/marketplace_db?schema=public"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
```

### 3. Generate Prisma Client & Push Schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Insert Demo Data (Seed Database)
Run the seed script to populate demo users, categories, products, orders, and reviews:
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

---

## 🚀 Deployment to Vercel

This repository includes a pre-configured `vercel.json` file for routing all Express API endpoints:

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

### Deploying manually via Vercel CLI:
```bash
npx vercel --prod
```

Make sure to set the following environment variables in the **Vercel Project Settings**:
- `DATABASE_URL` (Hosted PostgreSQL connection string, e.g. Neon / Supabase)
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

---

## 📄 License
This project is open source and available under the [ISC License](LICENSE).
