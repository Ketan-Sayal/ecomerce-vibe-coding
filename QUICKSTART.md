# Naksh Jewels E-Commerce - Quick Start Guide

## 🚀 One-Command Setup

### Using Docker (Recommended)

```bash
docker-compose up --build
```

This will:
1. ✅ Build the backend container
2. ✅ Build the frontend container
3. ✅ Start MongoDB
4. ✅ Start the backend server
5. ✅ Start the frontend server

**Wait 2-3 minutes for all services to start**

Then access:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API**: http://localhost:5000/api

---

## 📊 Seed Sample Products

After docker-compose is running, in a new terminal:

```bash
docker-compose exec backend npm run seed
```

This adds 10 sample jewelry products to the database.

---

## 🛑 Stop the Application

```bash
docker-compose down
```

To also remove data:
```bash
docker-compose down -v
```

---

## 💻 Local Development (Without Docker)

### Backend Setup

```bash
cd server
npm install
npm run dev
```
Server runs on: http://localhost:5000

### Frontend Setup

```bash
cd client
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

### Seed Data

```bash
cd server
npm run seed
```

---

## 🧪 Test the API

### Using curl:

```bash
# Get all products
curl http://localhost:5000/api/products

# Get single product
curl http://localhost:5000/api/products/PRODUCT_ID

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

### Using Postman:
1. Import the requests from [API.md](API.md)
2. Set `{{base_url}}` to `http://localhost:5000/api`
3. Run requests

---

## 📁 Project Structure

```
Ecommerce/
├── client/              # React frontend
├── server/              # Node.js backend
├── docker-compose.yml   # Container orchestration
├── README.md            # Full documentation
├── API.md               # API endpoints
└── QUICKSTART.md        # This file
```

---

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Docker Issues

```bash
# See logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Rebuild everything
docker-compose down -v
docker-compose up --build
```

### Database Connection Error

1. Verify `.env` has correct MongoDB URI
2. Check internet connection
3. MongoDB user credentials are valid

---

## ✨ Key Features

✅ Clean code structure  
✅ Input validation  
✅ Error handling  
✅ RESTful APIs  
✅ MongoDB database  
✅ Docker containerization  
✅ Responsive design  
✅ Sample data included  

---

## 📝 Next Steps

1. Start the application
2. Seed sample products
3. Visit http://localhost:3000
4. Click "Add to Cart"
5. Check the cart functionality

---

## 📚 Documentation

- [README.md](README.md) - Full documentation
- [API.md](API.md) - API endpoints reference

---

**Good luck with your assessment! 🎉**
