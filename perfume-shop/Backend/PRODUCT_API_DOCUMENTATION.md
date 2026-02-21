# Product API Documentation 📦

## Base URL
```
http://localhost:5000/api/admin
```

## Endpoints

### 1. Get All Products
**GET** `/products`

Get a list of all products with pagination, search, and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or description
- `category` (optional): Filter by category (perfume, attar, combo)
- `status` (optional): Filter by status (active, inactive, out-of-stock)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc, desc) (default: desc)

**Example Request:**
```bash
GET http://localhost:5000/api/admin/products?page=1&limit=10&search=rose&category=perfume
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "totalPages": 5,
  "currentPage": 1,
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "name": "Eternal Rose",
      "description": "A luxurious rose fragrance...",
      "category": "perfume",
      "actualPrice": 2499,
      "discount": 10,
      "finalPrice": 2249.1,
      "stock": 50,
      "mainImage": "/uploads/rose-main.jpg",
      "subImages": ["/uploads/rose-1.jpg", "/uploads/rose-2.jpg"],
      "featured": true,
      "bestseller": false,
      "sales": 125,
      "rating": 4.5,
      "reviews": 23,
      "status": "active",
      "createdAt": "2024-02-18T10:30:00.000Z",
      "updatedAt": "2024-02-18T10:30:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Product
**GET** `/products/:id`

Get details of a specific product by ID.

**Example Request:**
```bash
GET http://localhost:5000/api/admin/products/65f1234567890abcdef12345
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "name": "Eternal Rose",
    "description": "A luxurious rose fragrance...",
    "category": "perfume",
    "actualPrice": 2499,
    "discount": 10,
    "finalPrice": 2249.1,
    "stock": 50,
    "mainImage": "/uploads/rose-main.jpg",
    "subImages": ["/uploads/rose-1.jpg"],
    "featured": true,
    "bestseller": false,
    "sales": 125,
    "rating": 4.5,
    "reviews": 23,
    "status": "active",
    "createdAt": "2024-02-18T10:30:00.000Z",
    "updatedAt": "2024-02-18T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 3. Create Product
**POST** `/products`

Create a new product.

**Request Body:**
```json
{
  "name": "Eternal Rose",
  "description": "A luxurious rose fragrance that captures the essence of blooming roses",
  "category": "perfume",
  "actualPrice": 2499,
  "discount": 10,
  "stock": 50,
  "mainImage": "/uploads/rose-main.jpg",
  "subImages": ["/uploads/rose-1.jpg", "/uploads/rose-2.jpg"],
  "featured": true,
  "bestseller": false
}
```

**Required Fields:**
- `name` (string): Product name
- `description` (string): Product description
- `category` (string): perfume, attar, or combo
- `actualPrice` (number): Original price
- `mainImage` (string): Main product image URL

**Optional Fields:**
- `discount` (number): Discount percentage (0-100)
- `stock` (number): Stock quantity (default: 0)
- `subImages` (array): Additional product images (max 5)
- `featured` (boolean): Featured product flag
- `bestseller` (boolean): Bestseller flag

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "65f1234567890abcdef12345",
    "name": "Eternal Rose",
    "description": "A luxurious rose fragrance...",
    "category": "perfume",
    "actualPrice": 2499,
    "discount": 10,
    "finalPrice": 2249.1,
    "stock": 50,
    "mainImage": "/uploads/rose-main.jpg",
    "subImages": ["/uploads/rose-1.jpg", "/uploads/rose-2.jpg"],
    "featured": true,
    "bestseller": false,
    "sales": 0,
    "rating": 0,
    "reviews": 0,
    "status": "active",
    "createdAt": "2024-02-18T10:30:00.000Z",
    "updatedAt": "2024-02-18T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Please provide all required fields: name, description, category, actualPrice, mainImage"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Product name is required",
    "Price cannot be negative"
  ]
}
```

---

### 4. Update Product
**PUT** `/products/:id`

Update an existing product.

**Request Body:** (All fields optional)
```json
{
  "name": "Eternal Rose Premium",
  "actualPrice": 2999,
  "discount": 15,
  "stock": 75,
  "featured": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "65f1234567890abcdef12345",
    "name": "Eternal Rose Premium",
    "actualPrice": 2999,
    "discount": 15,
    "finalPrice": 2549.15,
    "stock": 75,
    "status": "active",
    ...
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 5. Delete Product
**DELETE** `/products/:id`

Delete a product permanently.

**Example Request:**
```bash
DELETE http://localhost:5000/api/admin/products/65f1234567890abcdef12345
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {}
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 6. Get Product Statistics
**GET** `/products/stats`

Get overall product statistics and analytics.

**Example Request:**
```bash
GET http://localhost:5000/api/admin/products/stats
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalProducts": 45,
    "activeProducts": 38,
    "outOfStock": 7,
    "featuredProducts": 12,
    "bestsellers": 8,
    "categoryStats": [
      {
        "_id": "perfume",
        "count": 30,
        "totalValue": 75000
      },
      {
        "_id": "attar",
        "count": 10,
        "totalValue": 25000
      },
      {
        "_id": "combo",
        "count": 5,
        "totalValue": 30000
      }
    ],
    "inventoryValue": 2500000
  }
}
```

---

## Testing with cURL

### Create Product
```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eternal Rose",
    "description": "A luxurious rose fragrance",
    "category": "perfume",
    "actualPrice": 2499,
    "discount": 10,
    "stock": 50,
    "mainImage": "/uploads/rose.jpg",
    "featured": true
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/admin/products
```

### Get Single Product
```bash
curl http://localhost:5000/api/admin/products/65f1234567890abcdef12345
```

### Update Product
```bash
curl -X PUT http://localhost:5000/api/admin/products/65f1234567890abcdef12345 \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 75,
    "discount": 15
  }'
```

### Delete Product
```bash
curl -X DELETE http://localhost:5000/api/admin/products/65f1234567890abcdef12345
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Validation Error) |
| 404 | Not Found |
| 500 | Server Error |

---

## Product Schema

```javascript
{
  name: String (required, max 200 chars),
  description: String (required, max 2000 chars),
  category: String (required, enum: perfume/attar/combo),
  actualPrice: Number (required, min 0),
  discount: Number (0-100, default 0),
  finalPrice: Number (auto-calculated),
  stock: Number (min 0, default 0),
  mainImage: String (required),
  subImages: Array of Strings (max 5),
  featured: Boolean (default false),
  bestseller: Boolean (default false),
  sales: Number (default 0),
  rating: Number (0-5, default 0),
  reviews: Number (default 0),
  status: String (enum: active/inactive/out-of-stock),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Business Logic

### Automatic Calculations
1. **Final Price**: Automatically calculated from actualPrice and discount
   ```
   finalPrice = actualPrice - (actualPrice * discount / 100)
   ```

2. **Status**: Automatically set based on stock
   - `stock > 0` → status = 'active'
   - `stock = 0` → status = 'out-of-stock'

### Indexes
- Text search on name and description
- Indexed fields: category, featured, bestseller, status

### Methods
- `updateStock(quantity)`: Update stock and status
- `incrementSales(quantity)`: Increment sales count
- `getFeatured()`: Get all featured products
- `getBestsellers()`: Get all bestseller products

---

## How to Start Server

1. **Install Dependencies:**
```bash
cd Backend
npm install
```

2. **Start MongoDB:**
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

3. **Start Server:**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

4. **Test API:**
```bash
# Health check
curl http://localhost:5000/api/admin/health

# Get products
curl http://localhost:5000/api/admin/products
```

---

## Next Steps

1. ✅ Product Model created
2. ✅ Product Controller created
3. ✅ Product Routes created
4. ⏳ Add image upload functionality (multer)
5. ⏳ Add authentication middleware
6. ⏳ Connect frontend to backend
7. ⏳ Add validation middleware
8. ⏳ Add rate limiting
9. ⏳ Add logging
10. ⏳ Write tests

---

## Status: ✅ READY TO USE

The Product API is fully functional and ready for testing!
