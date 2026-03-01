# Member Authentication & Cart Management System 🛒

## Overview
Complete user authentication and real-time cart management system for member side with proper user isolation.

## Features Implemented

### 1. User Authentication System
- ✅ User Registration
- ✅ User Login with JWT
- ✅ Get Current User Profile
- ✅ Update User Profile
- ✅ Password Hashing with bcrypt
- ✅ JWT Token Generation (7 days expiry)

### 2. Cart Management System
- ✅ Get User Cart
- ✅ Add Item to Cart
- ✅ Update Item Quantity
- ✅ Remove Item from Cart
- ✅ Clear Cart
- ✅ Auto-calculate Total Amount & Items
- ✅ User-specific Cart (Each user has their own cart)

## Database Models

### User Model (`Backend/Member/models/User.js`)
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  address: {
    street, city, state, pincode, country
  },
  status: Boolean (default: true),
  role: String (default: 'customer'),
  timestamps: true
}
```

### Cart Model (`Backend/Member/models/Cart.js`)
```javascript
{
  user: ObjectId (ref: User, unique),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number (min: 1),
    price: Number
  }],
  totalAmount: Number (auto-calculated),
  totalItems: Number (auto-calculated),
  timestamps: true
}
```

## API Endpoints

### Authentication APIs

#### 1. Register User
```
POST /api/member/auth/register
Body: { name, email, password, phone }
Response: { success, message, token, user }
```

#### 2. Login User
```
POST /api/member/auth/login
Body: { email, password }
Response: { success, message, token, user }
```

#### 3. Get Current User
```
GET /api/member/auth/me
Headers: Authorization: Bearer <token>
Response: { success, user }
```

#### 4. Update Profile
```
PUT /api/member/auth/profile
Headers: Authorization: Bearer <token>
Body: { name, phone, address }
Response: { success, message, user }
```

### Cart APIs (All Protected - Require Authentication)

#### 1. Get Cart
```
GET /api/member/cart
Headers: Authorization: Bearer <token>
Response: { success, cart }
```

#### 2. Add to Cart
```
POST /api/member/cart/add
Headers: Authorization: Bearer <token>
Body: { productId, quantity }
Response: { success, message, cart }
```

#### 3. Update Cart Item
```
PUT /api/member/cart/update
Headers: Authorization: Bearer <token>
Body: { productId, quantity }
Response: { success, message, cart }
```

#### 4. Remove from Cart
```
DELETE /api/member/cart/remove/:productId
Headers: Authorization: Bearer <token>
Response: { success, message, cart }
```

#### 5. Clear Cart
```
DELETE /api/member/cart/clear
Headers: Authorization: Bearer <token>
Response: { success, message, cart }
```

## Security Features

### 1. Password Security
- Passwords hashed using bcrypt with salt rounds
- Never stored in plain text
- Never returned in API responses

### 2. JWT Authentication
- Token generated on login/register
- 7 days expiry
- Stored in cookies on frontend
- Auto-attached to all protected requests

### 3. Protected Routes
- All cart operations require authentication
- Middleware validates JWT token
- User-specific data isolation

### 4. User Isolation
- Each user has their own cart
- Cart is linked to user ID
- No cross-user data access

## Controllers

### Auth Controller (`Backend/Member/controllers/authController.js`)
- `register()` - Create new user account
- `login()` - Authenticate user and return token
- `getMe()` - Get current user details
- `updateProfile()` - Update user information

### Cart Controller (`Backend/Member/controllers/cartController.js`)
- `getCart()` - Fetch user's cart
- `addToCart()` - Add product to cart
- `updateCartItem()` - Update product quantity
- `removeFromCart()` - Remove product from cart
- `clearCart()` - Empty the cart

## Routes

### Auth Routes (`Backend/Member/routes/authRoutes.js`)
- Public: `/register`, `/login`
- Protected: `/me`, `/profile`

### Cart Routes (`Backend/Member/routes/cartRoutes.js`)
- All routes protected with JWT middleware
- Base path: `/api/member/cart`

## Validation & Error Handling

### Input Validation
- Required fields checked
- Email format validation
- Password minimum length (6 characters)
- Quantity minimum value (1)

### Error Responses
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid credentials, no token)
- 404: Not Found (resource doesn't exist)
- 500: Server Error (unexpected errors)

### Success Responses
- 200: OK (successful operation)
- 201: Created (new resource created)

## Auto-Calculations

### Cart Totals
Automatically calculated before saving:
- `totalItems` = Sum of all item quantities
- `totalAmount` = Sum of (price × quantity) for all items

## User Flow

### Registration Flow
1. User fills registration form
2. Backend validates input
3. Checks if email already exists
4. Hashes password with bcrypt
5. Creates user in database
6. Generates JWT token
7. Returns token + user data
8. Frontend stores token in cookies

### Login Flow
1. User enters email & password
2. Backend finds user by email
3. Checks if account is active
4. Compares password with bcrypt
5. Generates JWT token
6. Returns token + user data
7. Frontend stores token in cookies

### Add to Cart Flow
1. User clicks "Add to Cart"
2. Frontend checks if user is logged in
3. If not logged in → Redirect to login
4. If logged in → Send request with token
5. Backend validates token
6. Checks if product exists & in stock
7. Finds or creates user's cart
8. Adds/updates product in cart
9. Auto-calculates totals
10. Returns updated cart

### Checkout Flow
1. User clicks "Checkout"
2. Frontend checks if user is logged in
3. If not logged in → Show login modal/redirect
4. If logged in → Proceed to checkout page
5. Display cart items & total
6. User completes order

## Next Steps (Frontend Integration)

1. Create Login/Register pages
2. Create authenticated API instance
3. Create Cart Redux slice
4. Update ProductCard/ProductDetail with real Add to Cart
5. Create Cart page
6. Add login check before checkout
7. Create protected routes

## Testing

### Test User Registration
```bash
POST http://localhost:5000/api/member/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "phone": "1234567890"
}
```

### Test Login
```bash
POST http://localhost:5000/api/member/auth/login
{
  "email": "test@example.com",
  "password": "test123"
}
```

### Test Add to Cart
```bash
POST http://localhost:5000/api/member/cart/add
Headers: Authorization: Bearer <your_token>
{
  "productId": "<product_id>",
  "quantity": 1
}
```

## Status: Backend Complete ✅

All backend APIs are ready. Next step is frontend integration.
