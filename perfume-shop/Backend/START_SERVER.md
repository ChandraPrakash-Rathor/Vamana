# Quick Start Guide - Backend Server

## Start the Server Manually

Open a terminal in the Backend folder and run:

```bash
cd Backend
node server.js
```

You should see:
```
✅ MongoDB Connected
✅ Server running on http://localhost:5000
📋 Admin API: http://localhost:5000/api/admin/health
```

## Test the API

Open another terminal and test:

```bash
# Health check
curl http://localhost:5000/api/admin/health

# Get all products
curl http://localhost:5000/api/admin/products

# Create a product
curl -X POST http://localhost:5000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eternal Rose",
    "description": "A luxurious rose fragrance",
    "category": "perfume",
    "actualPrice": 2499,
    "discount": 10,
    "stock": 50,
    "mainImage": "/uploads/rose.jpg"
  }'
```

## If Server Won't Start

1. **Check MongoDB is running:**
   ```bash
   pgrep mongod
   ```
   If not running, start it:
   ```bash
   mongod
   ```

2. **Check port 5000 is free:**
   ```bash
   lsof -i :5000
   ```

3. **Check .env file exists:**
   ```bash
   cat Backend/.env
   ```
   Should contain:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/vamana
   ```

## Your Product API is Ready! ✅

All files are created:
- ✅ Product Model
- ✅ Product Controller  
- ✅ Product Routes
- ✅ Server configured

Just start the server and test the endpoints!
