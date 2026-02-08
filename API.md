# API Documentation

## Naksh Jewels E-Commerce API

### Base URL
```
http://localhost:5000/api
```

---

## Endpoints

### Products

#### Get All Products
```
GET /products
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `category` - Filter by category
- `sortBy` (default: "-createdAt")

**Example:**
```
GET /products?page=1&limit=5&category=Rings
```

#### Get Product by ID
```
GET /products/:id
```

#### Get Products by Category
```
GET /products/category/:category
```

#### Create Product
```
POST /products
```

**Body:**
```json
{
  "name": "Diamond Ring",
  "description": "Beautiful diamond ring",
  "price": 5999,
  "originalPrice": 7999,
  "image": "https://...",
  "category": "Rings",
  "stock": 5,
  "rating": 4.8,
  "reviews": 24,
  "sku": "DR-001"
}
```

#### Update Product
```
PUT /products/:id
```

#### Delete Product
```
DELETE /products/:id
```

---

### Cart

#### Get Cart
```
GET /cart/:sessionId
```

#### Add to Cart
```
POST /cart
```

**Body:**
```json
{
  "sessionId": "user-session-123",
  "productId": "product-id",
  "quantity": 1
}
```

#### Update Cart Item
```
PATCH /cart
```

**Body:**
```json
{
  "sessionId": "user-session-123",
  "productId": "product-id",
  "quantity": 2
}
```

#### Remove from Cart
```
DELETE /cart/item
```

**Body:**
```json
{
  "sessionId": "user-session-123",
  "productId": "product-id"
}
```

#### Clear Cart
```
DELETE /cart/:sessionId
```

---

## Response Format

All responses follow this structure:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

---

## Error Handling

Error responses include:
- `statusCode` - HTTP status code
- `message` - Error description
- `success` - Always false for errors

**Example:**
```json
{
  "statusCode": 400,
  "message": "Product name is required",
  "success": false
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

---
