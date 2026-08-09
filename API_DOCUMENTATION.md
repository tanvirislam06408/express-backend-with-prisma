# API Documentation

Base URL: `http://localhost:5000`

All responses follow a consistent structure:

```json
{
  "success": true,
  "message": "A human readable message",
  "data": {}
}
```

**Common Status Codes**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Resource not found |
| 500 | Server error |

**Authentication**

Endpoints marked 🔒 require the JWT token. Pass it as:

```
Authorization: Bearer <token>
```

---

## 1. Auth — `/api/auth`

### Register a new user
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Description:** Creates a new user account. Password is hashed with bcrypt.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secret123"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "isDeleted": false,
      "createdAt": "2026-08-09T10:00:00.000Z",
      "updatedAt": "2026-08-09T10:00:00.000Z"
    }
  }
  ```
- **Status Codes:** 201 success; 400 invalid body / email already exists / password < 6 chars.

### Login
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Description:** Validates credentials and returns a JWT token (7-day expiry).
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "secret123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER"
      },
      "token": "<jwt-token>"
    }
  }
  ```
- **Status Codes:** 200 success; 401 invalid email/password or deleted account; 400 missing fields.

---

## 2. Users — `/api/users` 🔒

All routes in this section require the Bearer token.

### Create a user
- **Method:** `POST`
- **Endpoint:** `/api/users`
- **Description:** Creates a new user (raw route).
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "secret123"
  }
  ```
- **Success Response** (201): `{ "success": true, "data": { ...user } }`
- **Status Codes:** 201 success; 401 no/invalid token; 500 error.

### Get all users
- **Method:** `GET`
- **Endpoint:** `/api/users`
- **Description:** Returns all users.
- **Success Response** (200): `{ "success": true, "data": [ ...users ] }`
- **Status Codes:** 200 success; 401 no/invalid token; 500 error.

---

## 3. Categories — `/api/categories`

### Create a category
- **Method:** `POST`
- **Endpoint:** `/api/categories`
- **Description:** Creates a new category. Name must be unique.
- **Request Body:**
  ```json
  {
    "name": "Electronics"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "Category created successfully",
    "data": {
      "id": "uuid",
      "name": "Electronics",
      "isDeleted": false,
      "createdAt": "2026-08-09T10:00:00.000Z",
      "updatedAt": "2026-08-09T10:00:00.000Z"
    }
  }
  ```
- **Status Codes:** 201 success; 400 duplicate name / missing name.

### Get all categories
- **Method:** `GET`
- **Endpoint:** `/api/categories`
- **Description:** Returns all non-deleted categories, newest first.
- **Success Response** (200): `{ "success": true, "message": "Categories retrieved successfully", "data": [ ...categories ] }`
- **Status Codes:** 200 success; 500 error.

### Get category by ID
- **Method:** `GET`
- **Endpoint:** `/api/categories/:id`
- **Description:** Returns a single category.
- **Success Response** (200): `{ "success": true, "message": "Category retrieved successfully", "data": { ...category } }`
- **Status Codes:** 200 success; 400 invalid id; 404 not found.

### Update a category
- **Method:** `PATCH`
- **Endpoint:** `/api/categories/:id`
- **Description:** Updates the category name.
- **Request Body:**
  ```json
  {
    "name": "Consumer Electronics"
  }
  ```
- **Success Response** (200): `{ "success": true, "message": "Category updated successfully", "data": { ...category } }`
- **Status Codes:** 200 success; 400 invalid id; 404 not found.

### Delete a category (soft delete)
- **Method:** `DELETE`
- **Endpoint:** `/api/categories/:id`
- **Description:** Marks the category as deleted (`isDeleted: true`).
- **Success Response** (200): `{ "success": true, "message": "Category deleted successfully", "data": null }`
- **Status Codes:** 200 success; 400 invalid id; 404 not found.

---

## 4. Products — `/api/products`

### Create a product
- **Method:** `POST`
- **Endpoint:** `/api/products`
- **Description:** Creates a product. The referenced category must exist.
- **Request Body:**
  ```json
  {
    "name": "Wireless Mouse",
    "description": "A bluetooth mouse",
    "price": 29.99,
    "stock": 50,
    "categoryId": "uuid"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {
      "id": "uuid",
      "name": "Wireless Mouse",
      "description": "A bluetooth mouse",
      "price": 29.99,
      "stock": 50,
      "status": "ACTIVE",
      "isDeleted": false,
      "categoryId": "uuid",
      "category": { ... },
      "createdAt": "2026-08-09T10:00:00.000Z",
      "updatedAt": "2026-08-09T10:00:00.000Z"
    }
  }
  ```
- **Status Codes:** 201 success; 400 category not found / missing fields.

### Get all products
- **Method:** `GET`
- **Endpoint:** `/api/products`
- **Description:** Returns all non-deleted products with their category, newest first.
- **Success Response** (200): `{ "success": true, "message": "Products retrieved successfully", "data": [ ...products ] }`
- **Status Codes:** 200 success; 500 error.

### Get product by ID
- **Method:** `GET`
- **Endpoint:** `/api/products/:id`
- **Description:** Returns a single product with its category.
- **Success Response** (200): `{ "success": true, "message": "Product retrieved successfully", "data": { ...product } }`
- **Status Codes:** 200 success; 400 invalid id; 404 not found.

### Update a product
- **Method:** `PATCH`
- **Endpoint:** `/api/products/:id`
- **Description:** Updates any of the product fields. If `categoryId` is provided it must exist.
- **Request Body:** any subset of
  ```json
  {
    "name": "Wireless Mouse Pro",
    "description": "Updated description",
    "price": 34.99,
    "stock": 25,
    "status": "ACTIVE",
    "categoryId": "uuid"
  }
  ```
  Valid `status` values: `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`.
- **Success Response** (200): `{ "success": true, "message": "Product updated successfully", "data": { ...product } }`
- **Status Codes:** 200 success; 400 invalid id / category not found; 404 product not found.

### Delete a product (soft delete)
- **Method:** `DELETE`
- **Endpoint:** `/api/products/:id`
- **Description:** Marks the product as deleted (`isDeleted: true`).
- **Success Response** (200): `{ "success": true, "message": "Product deleted successfully", "data": null }`
- **Status Codes:** 200 success; 400 invalid id; 404 not found.

---

## 5. Orders — `/api/orders`

### Create an order
- **Method:** `POST`
- **Endpoint:** `/api/orders`
- **Description:** Creates an order. User and product must exist. If `totalPrice` is omitted it is computed as `product.price * quantity`.
- **Request Body:**
  ```json
  {
    "quantity": 2,
    "userId": "uuid",
    "productId": "uuid",
    "totalPrice": 59.98
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "Order created successfully",
    "data": {
      "id": "uuid",
      "quantity": 2,
      "totalPrice": 59.98,
      "status": "PENDING",
      "isDeleted": false,
      "userId": "uuid",
      "productId": "uuid",
      "user": { ... },
      "product": { ... },
      "createdAt": "2026-08-09T10:00:00.000Z",
      "updatedAt": "2026-08-09T10:00:00.000Z"
    }
  }
  ```
- **Status Codes:** 201 success; 400 user/product not found or invalid body.

### Get all orders
- **Method:** `GET`
- **Endpoint:** `/api/orders`
- **Description:** Returns all non-deleted orders with user and product, newest first.
- **Success Response** (200): `{ "success": true, "message": "Orders retrieved successfully", "data": [ ...orders ] }`
- **Status Codes:** 200 success; 500 error.

### Get order by ID
- **Method:** `GET`
- **Endpoint:** `/api/orders/:id`
- **Description:** Returns a single order with its user and product.
- **Success Response** (200): `{ "success": true, "message": "Order retrieved successfully", "data": { ...order } }`
- **Status Codes:** 200 success; 400 invalid id; 404 not found.

### Update an order
- **Method:** `PATCH`
- **Endpoint:** `/api/orders/:id`
- **Description:** Updates order fields. If `userId`/`productId` are provided they must exist.
- **Request Body:** any subset of
  ```json
  {
    "quantity": 3,
    "totalPrice": 89.97,
    "status": "CONFIRMED",
    "userId": "uuid",
    "productId": "uuid"
  }
  ```
  Valid `status` values: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`.
- **Success Response** (200): `{ "success": true, "message": "Order updated successfully", "data": { ...order } }`
- **Status Codes:** 200 success; 400 invalid id / user or product not found; 404 order not found.

### Delete an order (soft delete)
- **Method:** `DELETE`
- **Endpoint:** `/api/orders/:id`
- **Description:** Marks the order as deleted (`isDeleted: true`).
- **Success Response** (200): `{ "success": true, "message": "Order deleted successfully", "data": null }`
- **Status Codes:** 200 success; 400 invalid id; 404 not found.

---

## 6. Reviews — `/api/reviews`

### Create a review
- **Method:** `POST`
- **Endpoint:** `/api/reviews`
- **Description:** Creates a review. User and product must exist.
- **Request Body:**
  ```json
  {
    "rating": 5,
    "comment": "Great product",
    "userId": "uuid",
    "productId": "uuid"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "Review created successfully",
    "data": {
      "id": "uuid",
      "rating": 5,
      "comment": "Great product",
      "isDeleted": false,
      "userId": "uuid",
      "productId": "uuid",
      "user": { ... },
      "product": { ... },
      "createdAt": "2026-08-09T10:00:00.000Z",
      "updatedAt": "2026-08-09T10:00:00.000Z"
    }
  }
  ```
- **Status Codes:** 201 success; 400 user/product not found or invalid body.

### Get all reviews
- **Method:** `GET`
- **Endpoint:** `/api/reviews`
- **Description:** Returns all non-deleted reviews with user and product, newest first.
- **Success Response** (200): `{ "success": true, "message": "Reviews retrieved successfully", "data": [ ...reviews ] }`
- **Status Codes:** 200 success; 500 error.

### Get review by ID
- **Method:** `GET`
- **Endpoint:** `/api/reviews/:id`
- **Description:** Returns a single review with its user and product.
- **Success Response** (200): `{ "success": true, "message": "Review retrieved successfully", "data": { ...review } }`
- **Status Codes:** 200 success; 400 invalid id; 404 not found.

### Update a review
- **Method:** `PATCH`
- **Endpoint:** `/api/reviews/:id`
- **Description:** Updates review fields. If `userId`/`productId` are provided they must exist.
- **Request Body:** any subset of
  ```json
  {
    "rating": 4,
    "comment": "Updated comment",
    "userId": "uuid",
    "productId": "uuid"
  }
  ```
- **Success Response** (200): `{ "success": true, "message": "Review updated successfully", "data": { ...review } }`
- **Status Codes:** 200 success; 400 invalid id / user or product not found; 404 review not found.

### Delete a review (soft delete)
- **Method:** `DELETE`
- **Endpoint:** `/api/reviews/:id`
- **Description:** Marks the review as deleted (`isDeleted: true`).
- **Success Response** (200): `{ "success": true, "message": "Review deleted successfully", "data": null }`
- **Status Codes:** 200 success; 400 invalid id; 404 not found.

---

## Enums

| Enum | Values |
|------|--------|
| `UserRole` | `USER`, `ADMIN` |
| `ProductStatus` | `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK` |
| `OrderStatus` | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED` |

## Soft Delete

All `DELETE` endpoints perform a soft delete by setting `isDeleted: true`. Deleted records are excluded from `GET` queries. Pass the id of a deleted record to `GET` or `PATCH` and you will receive a 404.
