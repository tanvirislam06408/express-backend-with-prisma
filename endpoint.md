# API Endpoints & Testing Guide

Base URL (deployed on Vercel):

```
https://express-backend-wit-prisma.vercel.app
```

All requests and responses are **JSON**.

> **Auth note:** Only the `/api/users` endpoints require a Bearer token
> (from `POST /api/auth/login`). Categories, products, orders and reviews
> are currently **public** (no auth middleware).

---

## 1. Auth

### Register a new user
`POST /api/auth/register`

Request body:
```json
{
  "name": "Tanvir Hassan",
  "email": "tanvir@example.com",
  "password": "secret123"
}
```

cURL:
```bash
curl -X POST https://express-backend-wit-prisma.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Tanvir Hassan","email":"tanvir@example.com","password":"secret123"}'
```

Example response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "0a1b2c3d-...-uuid",
    "name": "Tanvir Hassan",
    "email": "tanvir@example.com",
    "role": "USER",
    "isDeleted": false,
    "createdAt": "2026-08-10T10:00:00.000Z",
    "updatedAt": "2026-08-10T10:00:00.000Z"
  }
}
```

> Password must be at least 6 characters. Duplicate email → `400 User already exists`.

### Login (get JWT token)
`POST /api/auth/login`

Request body:
```json
{
  "email": "tanvir@example.com",
  "password": "secret123"
}
```

cURL:
```bash
curl -X POST https://express-backend-wit-prisma.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tanvir@example.com","password":"secret123"}'
```

Example response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "0a1b2c3d-...-uuid",
      "name": "Tanvir Hassan",
      "email": "tanvir@example.com",
      "role": "USER",
      "isDeleted": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

> Save this `token`. Use it as `Authorization: Bearer <token>` for `/api/users`.

---

## 2. Users  🔒 (requires Bearer token)

Header for all requests in this section:
```
Authorization: Bearer <TOKEN_FROM_LOGIN>
```

### Create a user (direct, plain password)
`POST /api/users`

Body:
```json
{
  "name": "Rahim Uddin",
  "email": "rahim@example.com",
  "password": "secret123"
}
```

```bash
curl -X POST https://express-backend-wit-prisma.vercel.app/api/users \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahim Uddin","email":"rahim@example.com","password":"secret123"}'
```

### Get all users
`GET /api/users`

```bash
curl https://express-backend-wit-prisma.vercel.app/api/users \
  -H "Authorization: Bearer <TOKEN>"
```

Example response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "0a1b2c3d-...-uuid",
      "name": "Tanvir Hassan",
      "email": "tanvir@example.com",
      "password": "$2b$10$...",
      "role": "USER",
      "isDeleted": false,
      "createdAt": "2026-08-10T10:00:00.000Z",
      "updatedAt": "2026-08-10T10:00:00.000Z"
    }
  ]
}
```

---

## 3. Categories

### Create category
`POST /api/categories`

Body:
```json
{
  "name": "Electronics"
}
```

```bash
curl -X POST https://express-backend-wit-prisma.vercel.app/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics"}'
```

Example response (201):
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "c1e23f45-...-uuid",
    "name": "Electronics",
    "isDeleted": false,
    "createdAt": "2026-08-10T10:05:00.000Z",
    "updatedAt": "2026-08-10T10:05:00.000Z"
  }
}
```

> Duplicate name → `400 Category already exists`.

### Get all categories
`GET /api/categories`

```bash
curl https://express-backend-wit-prisma.vercel.app/api/categories
```

### Get category by ID
`GET /api/categories/:id`

```bash
curl https://express-backend-wit-prisma.vercel.app/api/categories/c1e23f45-...-uuid
```

### Update category
`PATCH /api/categories/:id`

Body:
```json
{
  "name": "Electronics & Gadgets"
}
```

### Delete category (soft delete)
`DELETE /api/categories/:id`

```bash
curl -X DELETE https://express-backend-wit-prisma.vercel.app/api/categories/c1e23f45-...-uuid
```

Example response (200):
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

---

## 4. Products

> A product must reference an **existing category id**.

### Create product
`POST /api/products`

Body:
```json
{
  "name": "Wireless Mouse",
  "description": "2.4GHz ergonomic wireless mouse",
  "price": 25.99,
  "stock": 50,
  "categoryId": "c1e23f45-...-uuid"
}
```

```bash
curl -X POST https://express-backend-wit-prisma.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Wireless Mouse","description":"2.4GHz ergonomic wireless mouse","price":25.99,"stock":50,"categoryId":"c1e23f45-...-uuid"}'
```

Example response (201):
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "p1a2b3c4-...-uuid",
    "name": "Wireless Mouse",
    "description": "2.4GHz ergonomic wireless mouse",
    "price": 25.99,
    "stock": 50,
    "status": "ACTIVE",
    "isDeleted": false,
    "categoryId": "c1e23f45-...-uuid",
    "createdAt": "2026-08-10T10:10:00.000Z",
    "updatedAt": "2026-08-10T10:10:00.000Z",
    "category": {
      "id": "c1e23f45-...-uuid",
      "name": "Electronics",
      "isDeleted": false
    }
  }
}
```

> Invalid `categoryId` → `400 Category not found`.

### Get all products
`GET /api/products`

```bash
curl https://express-backend-wit-prisma.vercel.app/api/products
```

### Get product by ID
`GET /api/products/:id`

### Update product
`PATCH /api/products/:id`

Body (all fields optional):
```json
{
  "price": 29.99,
  "stock": 45,
  "status": "ACTIVE"
}
```

Valid `status` values: `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`

### Delete product (soft delete)
`DELETE /api/products/:id`

---

## 5. Orders

> Requires an existing `userId` and `productId`. `totalPrice` is optional
> (auto-computed as `product.price * quantity` if omitted).

### Create order
`POST /api/orders`

Body:
```json
{
  "quantity": 2,
  "userId": "0a1b2c3d-...-uuid",
  "productId": "p1a2b3c4-...-uuid"
}
```

```bash
curl -X POST https://express-backend-wit-prisma.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{"quantity":2,"userId":"0a1b2c3d-...-uuid","productId":"p1a2b3c4-...-uuid"}'
```

Example response (201):
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "o5d6e7f8-...-uuid",
    "quantity": 2,
    "totalPrice": 51.98,
    "status": "PENDING",
    "isDeleted": false,
    "userId": "0a1b2c3d-...-uuid",
    "productId": "p1a2b3c4-...-uuid",
    "createdAt": "2026-08-10T10:15:00.000Z",
    "updatedAt": "2026-08-10T10:15:00.000Z",
    "user": { "id": "0a1b2c3d-...", "name": "Tanvir Hassan" },
    "product": { "id": "p1a2b3c4-...", "name": "Wireless Mouse" }
  }
}
```

> Unknown `userId` → `400 User not found`. Unknown `productId` → `400 Product not found`.

### Get all orders
`GET /api/orders`

### Get order by ID
`GET /api/orders/:id`

### Update order
`PATCH /api/orders/:id`

Body (all fields optional):
```json
{
  "status": "CONFIRMED",
  "quantity": 3
}
```

Valid `status` values: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

### Delete order (soft delete)
`DELETE /api/orders/:id`

---

## 6. Reviews

> Requires an existing `userId` and `productId`.

### Create review
`POST /api/reviews`

Body:
```json
{
  "rating": 5,
  "comment": "Great product, works perfectly!",
  "userId": "0a1b2c3d-...-uuid",
  "productId": "p1a2b3c4-...-uuid"
}
```

```bash
curl -X POST https://express-backend-wit-prisma.vercel.app/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Great product, works perfectly!","userId":"0a1b2c3d-...-uuid","productId":"p1a2b3c4-...-uuid"}'
```

Example response (201):
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "r7g8h9j0-...-uuid",
    "rating": 5,
    "comment": "Great product, works perfectly!",
    "userId": "0a1b2c3d-...-uuid",
    "productId": "p1a2b3c4-...-uuid",
    "isDeleted": false,
    "createdAt": "2026-08-10T10:20:00.000Z",
    "updatedAt": "2026-08-10T10:20:00.000Z",
    "user": { "id": "0a1b2c3d-...", "name": "Tanvir Hassan" },
    "product": { "id": "p1a2b3c4-...", "name": "Wireless Mouse" }
  }
}
```

### Get all reviews
`GET /api/reviews`

### Get review by ID
`GET /api/reviews/:id`

### Update review
`PATCH /api/reviews/:id`

Body:
```json
{
  "rating": 4,
  "comment": "Good value for money"
}
```

### Delete review (soft delete)
`DELETE /api/reviews/:id`

---

## Quick Test Flow (recommended order)

```bash
BASE=https://express-backend-wit-prisma.vercel.app

# 1. Register
curl -X POST $BASE/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Tanvir Hassan","email":"tanvir@example.com","password":"secret123"}'

# 2. Login → copy token
curl -X POST $BASE/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"tanvir@example.com","password":"secret123"}'

# 3. Create category → copy category id
curl -X POST $BASE/api/categories -H "Content-Type: application/json" \
  -d '{"name":"Electronics"}'

# 4. Create product (use the category id) → copy product id
curl -X POST $BASE/api/products -H "Content-Type: application/json" \
  -d '{"name":"Wireless Mouse","price":25.99,"stock":50,"categoryId":"<CATEGORY_ID>"}'

# 5. Create order (use user id from login + product id)
curl -X POST $BASE/api/orders -H "Content-Type: application/json" \
  -d '{"quantity":2,"userId":"<USER_ID>","productId":"<PRODUCT_ID>"}'

# 6. Create review
curl -X POST $BASE/api/reviews -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Awesome!","userId":"<USER_ID>","productId":"<PRODUCT_ID>"}'

# 7. Public read endpoints (no auth needed)
curl $BASE/api/products
curl $BASE/api/orders
curl $BASE/api/reviews
curl $BASE/api/categories
```
