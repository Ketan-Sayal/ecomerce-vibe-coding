# Naksh Jewels E-Commerce Platform

A full-stack e-commerce application built with **React**, **Node.js + Express**, and **MongoDB**. This project demonstrates clean code structure, proper error handling, state management, and Docker containerization.

## 📋 Project Overview

This is a mini e-commerce module featuring:
- **Frontend**: React with Redux/Context API for state management
- **Backend**: Node.js + Express with MongoDB
- **Containerization**: Docker & Docker Compose for easy deployment

---

## 🚀 Quick Start

### Prerequisites

Make sure you have installed:
- [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose
- Or alternatively: Node.js (v20+), npm, and MongoDB

### Option 1: Run with Docker (Recommended)

1. **Clone/Navigate to the project**
   ```bash
   cd path/to/Ecommerce
   ```

2. **Create a `.env` file in the root directory**
   ```env
   MONGODB_URI=mongodb+srv://ketansayal04_db_user:tIbOVj1LWFylhXqs@cluster0.r7xedvm.mongodb.net/?appName=Cluster0
   MONGO_ROOT_USERNAME=admin
   MONGO_ROOT_PASSWORD=password
   ```

3. **Start the entire application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

5. **Seed sample data** (in another terminal)
   ```bash
   docker-compose exec backend npm run seed
   ```

### Option 2: Run Locally Without Docker

#### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (already created at `server/.env`)
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://ketansayal04_db_user:tIbOVj1LWFylhXqs@cluster0.r7xedvm.mongodb.net/?appName=Cluster0
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Seed sample products** (in another terminal from `server` directory)
   ```bash
   npm run seed
   ```

#### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend**
   ```bash
   npm run dev
   ```

5. **Access at** http://localhost:3000

---

## 📁 Project Structure

```
Ecommerce/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   ├── pages/                   # Page components
│   │   ├── state/                   # Redux/Context state management
│   │   ├── styles/                  # CSS styling
│   │   └── App.jsx
│   ├── Dockerfile                   # Frontend container config
│   ├── .dockerignore
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── controllers/             # Route handlers
│   │   │   ├── productController.js
│   │   │   └── cartController.js
│   │   ├── models/                  # MongoDB schemas
│   │   │   ├── Product.js
│   │   │   └── Cart.js
│   │   ├── routes/                  # API routes
│   │   │   ├── productRoutes.js
│   │   │   └── cartRoutes.js
│   │   ├── middleware/              # Custom middleware
│   │   │   ├── validationMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── corsMiddleware.js
│   │   ├── utils/                   # Utility functions
│   │   │   ├── ApiResponse.js
│   │   │   ├── ApiError.js
│   │   │   └── AsyncHandler.js
│   │   ├── config/
│   │   │   └── index.js             # Configuration
│   │   ├── db/
│   │   │   └── index.js             # Database connection
│   │   ├── data/
│   │   │   └── sampleProducts.js    # Sample data
│   │   ├── app.js                   # Express app setup
│   │   ├── constant.js              # Constants
│   │   └── index.js                 # Server entry point
│   ├── seed.js                      # Database seeding script
│   ├── Dockerfile                   # Backend container config
│   ├── .dockerignore
│   ├── .env                         # Environment variables
│   └── package.json
│
├── docker-compose.yml               # Container orchestration
└── README.md                         # This file
```

---

## 🔌 Backend API Endpoints

### Products

#### **GET** `/api/products`
Get all products with pagination and filtering

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `category` - Filter by category
- `sortBy` (default: -createdAt) - Sort field (prefix with `-` for descending)

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "products": [...],
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

#### **GET** `/api/products/:id`
Get a single product by ID

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "name": "Diamond Necklace",
    "price": 4999,
    "stock": 5
  },
  "message": "Product retrieved successfully",
  "success": true
}
```

#### **GET** `/api/products/category/:category`
Get products by category

#### **POST** `/api/products`
Create a new product (Admin)

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 1999,
  "originalPrice": 2999,
  "image": "https://...",
  "category": "Rings",
  "stock": 10,
  "rating": 4.8,
  "reviews": 25,
  "sku": "UNIQUE-001"
}
```

#### **PUT** `/api/products/:id`
Update a product

#### **DELETE** `/api/products/:id`
Delete a product

---

### Shopping Cart

#### **GET** `/api/cart/:sessionId`
Get cart for a session

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "sessionId": "abc123",
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
  "message": "Cart retrieved successfully",
  "success": true
}
```

#### **POST** `/api/cart`
Add item to cart

**Request Body:**
```json
{
  "sessionId": "user-session-id",
  "productId": "product-id",
  "quantity": 1
}
```

#### **PATCH** `/api/cart`
Update item quantity in cart

**Request Body:**
```json
{
  "sessionId": "user-session-id",
  "productId": "product-id",
  "quantity": 2
}
```

#### **DELETE** `/api/cart/item`
Remove item from cart

**Request Body:**
```json
{
  "sessionId": "user-session-id",
  "productId": "product-id"
}
```

#### **DELETE** `/api/cart/:sessionId`
Clear entire cart

---

## 🛠 Technology Stack

### Frontend
- **React** - UI library
- **Redux** or **Context API** - State management
- **CSS** - Styling (no UI libraries)
- **Responsive Design** - Mobile-friendly

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM (Object Document Mapper)

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## ✨ Features Implemented

### Backend
✅ Clean, modular code structure  
✅ Comprehensive input validation  
✅ Proper error handling with custom middleware  
✅ RESTful API design  
✅ MongoDB integration with Mongoose schemas  
✅ Environment variables using `.env`  
✅ Async/await error handling  
✅ CORS middleware for frontend communication  
✅ Sample product data with seeding script  
✅ Cart management with session-based storage  
✅ Stock validation  
✅ Pagination and filtering support  

### Docker & DevOps
✅ Multi-stage Docker builds for optimization  
✅ docker-compose.yml for orchestration  
✅ Health checks for all services  
✅ Proper signal handling  
✅ Non-root user execution for security  
✅ Persistent MongoDB volumes  
✅ Network isolation  

---

## 🚦 Running Tests

### Test Backend Endpoints

Use Postman, Insomnia, or curl:

```bash
# Get all products
curl http://localhost:5000/api/products

# Add to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session",
    "productId": "PRODUCT_ID",
    "quantity": 1
  }'

# Get cart
curl http://localhost:5000/api/cart/test-session
```

---

## 🔐 Security Features

- Input validation on all endpoints
- MongoDB injection prevention via Mongoose
- CORS configuration for cross-origin requests
- Non-root user execution in Docker
- Environment variables for sensitive data
- Proper HTTP status codes
- Error sanitization

---

## 📦 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Change the port in docker-compose.yml
# Or kill the process using the port
```

**MongoDB connection failure:**
- Ensure MongoDB credentials in `.env` are correct
- Check internet connection for cloud MongoDB
- Verify the MONGODB_URI format

**Container won't start:**
```bash
# View logs
docker-compose logs backend
docker-compose logs mongodb

# Rebuild containers
docker-compose up --build --force-recreate
```

### Local Development Issues

**Dependencies not installed:**
```bash
npm install
```

**Port conflicts:**
```bash
# Change PORT in .env files
```

**Database connection error:**
- Verify MongoDB is running
- Check MONGODB_URI in `.env`

---

## 📝 Git Commit Guidelines

Use meaningful commit messages:
```bash
git commit -m "feat: Add product filtering API"
git commit -m "fix: Cart quantity update validation"
git commit -m "refactor: Modularize middleware"
git commit -m "docs: Update API documentation"
```

---

## 🎯 API Health Check

```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Server is healthy and running",
  "success": true
}
```

---

## 📄 License

ISC

---

## 👥 Author

Owner

---

## 🎉 Next Steps

1. **Seed the database** with sample products
2. **Test API endpoints** using Postman or curl
3. **Build the frontend** to consume these APIs
4. **Deploy using Docker Compose**

Good luck with your internship assessment! 🚀
