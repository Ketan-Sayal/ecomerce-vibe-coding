# 🧪 Testing Guide - Naksh Jewels E-Commerce

## Prerequisites
- Docker & Docker Compose installed, OR
- Node.js 20+, npm, and MongoDB running locally

---

## 🚀 Start the Application

### Using Docker
```bash
docker-compose up --build
```

### Locally
**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Seeds Database:**
```bash
cd server
npm run seed
```

**Terminal 3 - Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## ✅ API Tests

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "Server is healthy and running",
  "success": true
}
```

---

### Test 2: Get All Products

```bash
curl http://localhost:5000/api/products
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "products": [
      {
        "_id": "...",
        "name": "Diamond Necklace",
        "price": 4999,
        "category": "Necklaces",
        "stock": 5,
        ...
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalProducts": 10,
      "totalPages": 1
    }
  },
  "message": "Products retrieved successfully",
  "success": true
}
```

**Verify:**
- ✅ Returns 10 products
- ✅ All fields present
- ✅ Pagination info included

---

### Test 3: Get Single Product

```bash
# Replace PRODUCT_ID with actual ID from Test 2
curl http://localhost:5000/api/products/PRODUCT_ID
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "name": "Diamond Necklace",
    "description": "...",
    "price": 4999,
    ...
  },
  "message": "Product retrieved successfully",
  "success": true
}
```

**Verify:**
- ✅ Returns single product
- ✅ All details present

---

### Test 4: Get Products by Category

```bash
curl "http://localhost:5000/api/products/category/Rings"
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "products": [
      {
        "name": "Emerald Ring",
        "category": "Rings",
        ...
      },
      {
        "name": "Ruby Ring",
        "category": "Rings",
        ...
      }
    ],
    "pagination": { ... }
  },
  "success": true
}
```

**Verify:**
- ✅ Returns only Rings category products
- ✅ Pagination included

---

### Test 5: Add Product to Cart

```bash
# Get a product ID first from Test 2
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-user-123",
    "productId": "PRODUCT_ID",
    "quantity": 1
  }'
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "sessionId": "test-user-123",
    "items": [
      {
        "productId": "...",
        "name": "Diamond Necklace",
        "price": 4999,
        "quantity": 1,
        "totalPrice": 4999
      }
    ],
    "totalItems": 1,
    "totalPrice": 4999
  },
  "message": "Item added to cart successfully",
  "success": true
}
```

**Verify:**
- ✅ Cart created with sessionId
- ✅ Item added with correct quantity
- ✅ Totals calculated correctly

---

### Test 6: Get Cart

```bash
curl http://localhost:5000/api/cart/test-user-123
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "sessionId": "test-user-123",
    "items": [ ... ],
    "totalItems": 1,
    "totalPrice": 4999
  },
  "message": "Cart retrieved successfully",
  "success": true
}
```

**Verify:**
- ✅ Cart retrieved correctly
- ✅ All items present
- ✅ Totals correct

---

### Test 7: Update Cart Item Quantity

```bash
curl -X PATCH http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-user-123",
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "quantity": 2,
        "totalPrice": 9998
      }
    ],
    "totalItems": 2,
    "totalPrice": 9998
  },
  "message": "Cart item updated successfully",
  "success": true
}
```

**Verify:**
- ✅ Quantity updated to 2
- ✅ Total price recalculated (4999 × 2 = 9998)
- ✅ Cart totals updated

---

### Test 8: Add Multiple Items to Cart

```bash
# Get another product ID
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-user-123",
    "productId": "ANOTHER_PRODUCT_ID",
    "quantity": 1
  }'
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "items": [
      { ... },
      { "name": "Gold Bracelet", "quantity": 1, ... }
    ],
    "totalItems": 3,
    "totalPrice": 12497
  },
  "success": true
}
```

**Verify:**
- ✅ Both items in cart
- ✅ Correct total items count
- ✅ Correct total price sum

---

### Test 9: Remove Item from Cart

```bash
curl -X DELETE http://localhost:5000/api/cart/item \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-user-123",
    "productId": "PRODUCT_ID"
  }'
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "items": [
      { "name": "Gold Bracelet", ... }
    ],
    "totalItems": 1,
    "totalPrice": 2499
  },
  "message": "Item removed from cart successfully",
  "success": true
}
```

**Verify:**
- ✅ Item removed from cart
- ✅ Cart totals recalculated
- ✅ Only 1 item remains

---

### Test 10: Clear Cart

```bash
curl -X DELETE http://localhost:5000/api/cart/test-user-123
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "data": {
    "items": [],
    "totalItems": 0,
    "totalPrice": 0
  },
  "message": "Cart cleared successfully",
  "success": true
}
```

**Verify:**
- ✅ All items removed
- ✅ Totals reset to 0

---

## ❌ Error Testing

### Test 11: Invalid Product ID Format

```bash
curl http://localhost:5000/api/products/invalid-id
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Invalid id format",
  "success": false
}
```

---

### Test 12: Non-existent Product

```bash
curl http://localhost:5000/api/products/507f1f77bcf86cd799439011
```

**Expected Response:**
```json
{
  "statusCode": 404,
  "message": "Product not found.",
  "success": false
}
```

---

### Test 13: Missing Required Fields (Add to Cart)

```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-user-123"
  }'
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Product ID is required",
  "success": false
}
```

---

### Test 14: Insufficient Stock

```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-user-123",
    "productId": "PRODUCT_ID",
    "quantity": 50
  }'
```

**Assuming product has only 5 in stock:**

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Insufficient stock. Available: 5",
  "success": false
}
```

---

### Test 15: Invalid Route

```bash
curl http://localhost:5000/api/invalid-endpoint
```

**Expected Response:**
```json
{
  "statusCode": 404,
  "message": "Route GET /api/invalid-endpoint not found",
  "success": false
}
```

---

## 🎨 Frontend Tests

### Test 16: Frontend Loads

1. Open http://localhost:3000 in browser
2. Verify:
   - ✅ Naksh Jewels header appears
   - ✅ Product grid loads
   - ✅ 10 products display
   - ✅ Product images load
   - ✅ Prices visible
   - ✅ Add to Cart buttons present

### Test 17: Responsive Design

1. Resize browser window
2. Verify:
   - ✅ Grid adjusts (3 cols → 2 cols → 1 col)
   - ✅ Text remains readable
   - ✅ Images scale properly
   - ✅ Buttons clickable on mobile

### Test 18: Product Details Display

1. Check each product card has:
   - ✅ Product image
   - ✅ Product name
   - ✅ Category badge
   - ✅ Description excerpt
   - ✅ Current price
   - ✅ Original price (strikethrough)
   - ✅ Star rating
   - ✅ Review count
   - ✅ Add to Cart button

---

## 📊 Docker Tests

### Test 19: Docker Compose Up

```bash
docker-compose up --build
```

**Verify:**
- ✅ Frontend builds without errors
- ✅ Backend builds without errors
- ✅ MongoDB starts
- ✅ All services start
- ✅ Health checks pass
- ✅ No critical errors in logs

### Test 20: Service Health Checks

```bash
docker-compose ps
```

**Expected:**
```
NAME                    STATUS
ecommerce-backend       Up (healthy)
ecommerce-frontend      Up (healthy)
ecommerce-mongodb       Up (healthy)
```

---

## 🔍 Logs Inspection

### View Backend Logs
```bash
docker-compose logs backend
```

**Should see:**
- ✅ "MongoDB connected"
- ✅ "Server is running at port: 5000"

### View Frontend Logs
```bash
docker-compose logs frontend
```

**Should see:**
- ✅ Build successful
- ✅ Serve running on port 3000

### View MongoDB Logs
```bash
docker-compose logs mongodb
```

**Should see:**
- ✅ Ready to accept connections

---

## ✅ Comprehensive Test Checklist

### Backend Tests
- [ ] Health check works
- [ ] Get all products
- [ ] Get single product
- [ ] Get products by category
- [ ] Add to cart
- [ ] Get cart
- [ ] Update cart item
- [ ] Add multiple items
- [ ] Remove item
- [ ] Clear cart
- [ ] Invalid ID format error
- [ ] Not found error
- [ ] Missing fields error
- [ ] Insufficient stock error
- [ ] Invalid route error

### Frontend Tests
- [ ] Page loads
- [ ] Products display
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] All product details visible
- [ ] Images load correctly
- [ ] Buttons are clickable

### Docker Tests
- [ ] docker-compose up works
- [ ] All services healthy
- [ ] No error logs
- [ ] Can access frontend
- [ ] Can access backend

---

## 🎯 Test Results

Date: ___________  
Tester: _________  

### Backend: ✅ / ❌
### Frontend: ✅ / ❌
### Docker: ✅ / ❌

**Overall Status:** ✅ PASSED / ❌ FAILED

---

## 📝 Notes

Document any issues found during testing:

__________________________________________
__________________________________________
__________________________________________

---

**All tests should PASS before submission!**
