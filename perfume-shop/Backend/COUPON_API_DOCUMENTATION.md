# Coupon API Documentation

Complete API documentation for the Coupon Management System.

## Base URL
```
http://localhost:5000/api/admin
```

## Endpoints

### 1. Get All Coupons
Get a list of all coupons in the system.

**Endpoint:** `GET /GetCoupons`

**Response:**
```json
{
  "status": "success",
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "code": "SAVE20",
      "description": "Get 20% off on all products",
      "discountType": "percentage",
      "discountValue": 20,
      "minPurchase": 1000,
      "maxDiscount": 500,
      "usageLimit": 100,
      "usedCount": 15,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.000Z",
      "status": "active",
      "applicableCategories": ["all"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Coupon
Create a new coupon.

**Endpoint:** `POST /insertCoupon`

**Request Body:**
```json
{
  "code": "SAVE20",
  "description": "Get 20% off on all products",
  "discountType": "percentage",
  "discountValue": 20,
  "minPurchase": 1000,
  "maxDiscount": 500,
  "usageLimit": 100,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "applicableCategories": ["all"]
}
```

**Field Descriptions:**
- `code` (required): Unique coupon code (uppercase, max 20 chars)
- `description` (required): Description of the coupon
- `discountType` (required): "percentage" or "fixed"
- `discountValue` (required): Discount amount (% or fixed amount)
- `minPurchase` (optional): Minimum purchase amount required (default: 0)
- `maxDiscount` (optional): Maximum discount cap for percentage coupons
- `usageLimit` (optional): Maximum number of times coupon can be used
- `startDate` (required): Coupon start date
- `endDate` (required): Coupon end date
- `applicableProducts` (optional): Array of product IDs
- `applicableCategories` (optional): Array of categories ["perfume", "attar", "combo", "all"]

**Response:**
```json
{
  "status": "success",
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "_id": "...",
    "code": "SAVE20",
    "description": "Get 20% off on all products",
    "discountType": "percentage",
    "discountValue": 20,
    "minPurchase": 1000,
    "maxDiscount": 500,
    "usageLimit": 100,
    "usedCount": 0,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.000Z",
    "status": "active",
    "applicableCategories": ["all"]
  }
}
```

---

### 3. Get Coupon by ID
Get a specific coupon by its ID.

**Endpoint:** `GET /coupons/:id`

**Response:**
```json
{
  "status": "success",
  "success": true,
  "data": {
    "_id": "...",
    "code": "SAVE20",
    "description": "Get 20% off on all products",
    ...
  }
}
```

---

### 4. Get Coupon by Code
Get a specific coupon by its code.

**Endpoint:** `GET /coupons/code/:code`

**Example:** `GET /coupons/code/SAVE20`

**Response:**
```json
{
  "status": "success",
  "success": true,
  "data": {
    "_id": "...",
    "code": "SAVE20",
    ...
  }
}
```

---

### 5. Update Coupon
Update an existing coupon.

**Endpoint:** `PUT /coupons/:id`

**Request Body:** (All fields optional)
```json
{
  "description": "Updated description",
  "discountValue": 25,
  "usageLimit": 200,
  "status": "inactive"
}
```

**Response:**
```json
{
  "status": "success",
  "success": true,
  "message": "Coupon updated successfully",
  "data": {
    ...updated coupon data
  }
}
```

---

### 6. Delete Coupon
Delete a coupon.

**Endpoint:** `DELETE /coupons/:id`

**Response:**
```json
{
  "status": "success",
  "success": true,
  "message": "Coupon deleted successfully",
  "data": {}
}
```

---

### 7. Validate Coupon
Validate a coupon and calculate discount.

**Endpoint:** `POST /coupons/validate`

**Request Body:**
```json
{
  "code": "SAVE20",
  "purchaseAmount": 3000,
  "productIds": ["product_id_1", "product_id_2"],
  "categories": ["perfume", "attar"]
}
```

**Response (Valid):**
```json
{
  "status": "success",
  "success": true,
  "message": "Coupon is valid",
  "data": {
    "coupon": {
      "code": "SAVE20",
      "description": "Get 20% off on all products",
      "discountType": "percentage",
      "discountValue": 20
    },
    "discount": 500,
    "finalAmount": 2500
  }
}
```

**Response (Invalid):**
```json
{
  "success": false,
  "message": "Minimum purchase of ₹1000 required"
}
```

---

### 8. Get Coupon Statistics
Get statistics about coupons.

**Endpoint:** `GET /coupons/stats`

**Response:**
```json
{
  "status": "success",
  "success": true,
  "data": {
    "totalCoupons": 10,
    "activeCoupons": 7,
    "expiredCoupons": 2,
    "inactiveCoupons": 1,
    "mostUsed": [
      {
        "_id": "...",
        "code": "SAVE20",
        "description": "Get 20% off on all products",
        "usedCount": 150,
        "usageLimit": 200
      }
    ]
  }
}
```

---

## Coupon Model Schema

```javascript
{
  code: String (required, unique, uppercase, max 20 chars),
  description: String (required, max 500 chars),
  discountType: String (required, enum: ['percentage', 'fixed']),
  discountValue: Number (required, min: 0),
  minPurchase: Number (default: 0, min: 0),
  maxDiscount: Number (optional, min: 0),
  usageLimit: Number (optional, min: 1),
  usedCount: Number (default: 0, min: 0),
  startDate: Date (required),
  endDate: Date (required),
  status: String (enum: ['active', 'inactive', 'expired'], default: 'active'),
  applicableProducts: [ObjectId] (ref: 'Product'),
  applicableCategories: [String] (enum: ['perfume', 'attar', 'combo', 'all']),
  timestamps: true
}
```

---

## Coupon Types

### 1. Percentage Discount
```json
{
  "code": "SAVE20",
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscount": 500
}
```
- Gives 20% off
- Maximum discount capped at ₹500

### 2. Fixed Discount
```json
{
  "code": "FLAT500",
  "discountType": "fixed",
  "discountValue": 500
}
```
- Gives flat ₹500 off

---

## Validation Rules

1. **Code Uniqueness**: Coupon codes must be unique
2. **Date Validation**: End date must be after start date
3. **Discount Value**: Must be positive number
4. **Usage Limit**: If set, must be at least 1
5. **Status Auto-Update**: Status automatically changes to 'expired' when end date passes
6. **Minimum Purchase**: Coupon only valid if purchase amount >= minPurchase
7. **Category/Product Matching**: If specified, coupon only valid for applicable items

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["End date must be after start date"]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Coupon not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Error details..."
}
```

---

## Testing

Run the test script:
```bash
cd Backend
node test-coupon-api.js
```

This will:
1. Create sample coupons
2. Test validation logic
3. Test discount calculations
4. Verify all CRUD operations

---

## Notes

- All coupon codes are automatically converted to uppercase
- Coupons automatically expire when end date passes
- Usage count is tracked but must be manually incremented when coupon is used in orders
- Discount calculations respect max discount caps for percentage coupons
- Discount cannot exceed purchase amount for fixed coupons
