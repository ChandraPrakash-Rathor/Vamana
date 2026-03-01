# Member Authentication & Cart - Frontend Integration ✅

## Overview
Complete frontend integration of authentication and cart management system with Redux.

## Files Created

### 1. APIs (`member/src/redux/apis/`)

#### AuthApi.js
- `registerUser()` - Register new user
- `loginUser()` - Login user
- `getCurrentUser()` - Get current user profile
- `updateProfile()` - Update user profile
- `logoutUser()` - Logout (client-side)
- Axios interceptor for JWT token
- Auto-redirect on 401 errors

#### CartApi.js
- `getCart()` - Fetch user cart
- `addToCart()` - Add product to cart
- `updateCartItem()` - Update quantity
- `removeFromCart()` - Remove product
- `clearCart()` - Empty cart

### 2. Slices (`member/src/redux/slices/`)

#### AuthSlice.js
**State:**
```javascript
{
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  success: null
}
```

**Actions:**
- `clearError()` - Clear error message
- `clearSuccess()` - Clear success message
- `logout()` - Logout user

#### CartSlice.js
**State:**
```javascript
{
  cart: null,
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null,
  success: null
}
```

**Actions:**
- `clearError()` - Clear error message
- `clearSuccess()` - Clear success message
- `resetCart()` - Reset cart state

### 3. Store Configuration
Updated `member/src/redux/store/store.js` with:
- AuthSlice
- CartSlice

## Token Management

### Storage
- Token stored in cookies: `memberToken`
- Auth status: `isAuthenticated`
- Expiry: 7 days

### Auto-Attachment
- Axios interceptor automatically adds token to all requests
- Header: `Authorization: Bearer <token>`

### Error Handling
- 401 errors trigger auto-logout
- Dispatches `unauthorized` event
- Clears cookies and redirects

## Usage Examples

### 1. Register User
```javascript
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/apis/AuthApi';

const dispatch = useDispatch();

const handleRegister = async () => {
  const result = await dispatch(registerUser({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '1234567890'
  }));
  
  if (result.payload?.success) {
    // Registration successful
    // Token automatically stored in cookies
  }
};
```

### 2. Login User
```javascript
import { loginUser } from '../redux/apis/AuthApi';

const handleLogin = async () => {
  const result = await dispatch(loginUser({
    email: 'john@example.com',
    password: 'password123'
  }));
  
  if (result.payload?.success) {
    // Login successful
    // Token automatically stored
  }
};
```

### 3. Get Current User
```javascript
import { getCurrentUser } from '../redux/apis/AuthApi';
import { useSelector } from 'react-redux';

// On app load
useEffect(() => {
  const token = Cookies.get('memberToken');
  if (token) {
    dispatch(getCurrentUser());
  }
}, []);

// Access user data
const { user, isAuthenticated } = useSelector(state => state.AuthSlice);
```

### 4. Add to Cart
```javascript
import { addToCart } from '../redux/apis/CartApi';

const handleAddToCart = async (productId) => {
  const result = await dispatch(addToCart({ 
    productId, 
    quantity: 1 
  }));
  
  if (result.payload?.success) {
    toast.success('Added to cart!');
  }
};
```

### 5. Get Cart
```javascript
import { getCart } from '../redux/apis/CartApi';
import { useSelector } from 'react-redux';

// Fetch cart
useEffect(() => {
  if (isAuthenticated) {
    dispatch(getCart());
  }
}, [isAuthenticated]);

// Access cart data
const { items, totalAmount, totalItems } = useSelector(state => state.CartSlice);
```

### 6. Update Cart Item
```javascript
import { updateCartItem } from '../redux/apis/CartApi';

const handleUpdateQuantity = async (productId, newQuantity) => {
  await dispatch(updateCartItem({ 
    productId, 
    quantity: newQuantity 
  }));
};
```

### 7. Remove from Cart
```javascript
import { removeFromCart } from '../redux/apis/CartApi';

const handleRemove = async (productId) => {
  await dispatch(removeFromCart(productId));
};
```

### 8. Logout
```javascript
import { logoutUser } from '../redux/apis/AuthApi';

const handleLogout = () => {
  logoutUser(); // Clears cookies and redirects
};
```

## Protected Routes Pattern

```javascript
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.AuthSlice);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Usage
<Route path="/checkout" element={
  <ProtectedRoute>
    <Checkout />
  </ProtectedRoute>
} />
```

## Add to Cart with Login Check

```javascript
const handleAddToCart = async (productId) => {
  const { isAuthenticated } = useSelector(state => state.AuthSlice);
  
  if (!isAuthenticated) {
    // Show login modal or redirect
    toast.error('Please login to add items to cart');
    // Open login modal
    return;
  }
  
  // Add to cart
  await dispatch(addToCart({ productId, quantity: 1 }));
};
```

## Next Steps

### 1. Create Login/Register Pages
- Login form component
- Register form component
- Form validation
- Error/success messages

### 2. Create Login Modal
- Modal component for quick login
- Show when user tries to add to cart without login
- Redirect after successful login

### 3. Update ProductCard Component
- Replace dummy "Add to Cart" with real functionality
- Check authentication before adding
- Show login modal if not authenticated

### 4. Update ProductDetail Page
- Real "Add to Cart" functionality
- Quantity selector
- Stock check

### 5. Create Cart Page
- Display cart items
- Update quantity
- Remove items
- Show total
- Checkout button

### 6. Create Checkout Flow
- Protected route
- Address form
- Order summary
- Payment integration

### 7. Add Cart Icon in Header
- Show cart item count
- Link to cart page
- Update in real-time

## Dependencies Installed
✅ js-cookie - For cookie management

## Status: Frontend APIs Ready ✅

All Redux APIs and slices are configured. Ready to create UI components!
