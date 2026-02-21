# Admin Authentication Setup - Complete Guide

## ✅ What's Already Done

### Backend (Complete)
- ✅ Admin Model (`AuthModal.js`) - stores admin users
- ✅ Auth Controller (`AuthController.js`) - handles login logic
- ✅ Auth Routes - `/api/admin/login` endpoint
- ✅ Server configured and ready

### Frontend (Complete)
- ✅ Redux Toolkit installed (`@reduxjs/toolkit`, `react-redux`, `axios`)
- ✅ Redux folder structure created:
  - `admin/src/APIS/apis/` - API calls
  - `admin/src/APIS/slice/` - Redux slices
  - `admin/src/APIS/store/` - Store configuration
- ✅ `config.js` - Base URL configuration
- ✅ `Authapi.js` - Login async thunk
- ✅ `Authslice.js` - Auth state management
- ✅ `store.js` - Redux store
- ✅ Login page integrated with Redux
- ✅ Toast notifications configured
- ✅ Cookie-based authentication

## 🚀 How to Start

### Step 1: Create Admin User

Open terminal in Backend folder:

```bash
cd Backend
node create-admin.js
```

This creates an admin user:
- Email: `admin@vamana.com`
- Password: `admin123`

### Step 2: Start Backend Server

In the same terminal:

```bash
node server.js
```

You should see:
```
✅ MongoDB Connected
✅ Server running on http://localhost:5000
📋 Admin API: http://localhost:5000/api/admin/health
```

### Step 3: Start Admin Panel

Open a new terminal in admin folder:

```bash
cd admin
npm start
```

The admin panel will open at `http://localhost:3000`

### Step 4: Login

1. Go to `http://localhost:3000/login`
2. Enter credentials:
   - Username: `admin@vamana.com`
   - Password: `admin123`
3. Click "Sign In"

## 🔄 How It Works

### Login Flow

1. **User enters credentials** in Login page
2. **Form submits** using react-hook-form
3. **Data converted to FormData** (email, password)
4. **Redux action dispatched**: `loginUser(formData)`
5. **API call made** to `http://localhost:5000/api/admin/login`
6. **Backend validates** credentials against database
7. **Response returned** with status and admin data
8. **Redux state updated** with login data
9. **Cookie set** for authentication
10. **User redirected** to dashboard

### Code Flow

#### Frontend (Login.jsx)
```javascript
const onSubmit = async(data) => {
  const formData = new FormData();
  formData.append('email', data.username);
  formData.append('password', data.password);
  
  const res = await dispatch(loginUser(formData));
  
  if(res?.payload?.status == "success"){
    toast.success("Login Successful!");
    Cookies.set("isAuthenticate", res?.payload?.success);
    navigate("/dashboard");
  } else {
    toast.error("Invalid credentials");
  }
}
```

#### Redux API (Authapi.js)
```javascript
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data) => {
    let url = baseUrl + 'login';
    const response = (await axios.post(url, data)).data;
    
    if(response.status === "success"){
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  }
);
```

#### Backend Controller (AuthController.js)
```javascript
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  
  const admin = await AuthModal.findOne({ email });
  
  if (!admin) {
    return res.json({ status: "error", message: "Admin not found" });
  }
  
  if (admin.password !== password) {
    return res.json({ status: "error", message: "Invalid password" });
  }
  
  res.json({
    status: "success",
    success: true,
    message: "Login successful",
    admin
  });
};
```

## 📁 File Structure

```
Backend/
├── Admin/
│   ├── models/
│   │   └── AuthModal.js          # Admin user schema
│   ├── controllers/
│   │   └── AuthController.js     # Login logic
│   └── routes/
│       └── adminRoutes.js        # Routes including /login
├── server.js                     # Main server
└── create-admin.js               # Script to create admin user

admin/src/
├── APIS/
│   ├── apis/
│   │   ├── Authapi.js           # Login async thunk
│   │   └── config.js            # Base URL
│   ├── slice/
│   │   └── Authslice.js         # Auth state management
│   └── store/
│       └── store.js             # Redux store
├── pages/
│   └── Login.jsx                # Login page
└── index.js                     # Provider setup
```

## 🧪 Testing the API

### Using curl:

```bash
# Test login with correct credentials
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vamana.com","password":"admin123"}'

# Expected response:
{
  "status": "success",
  "success": true,
  "message": "Login successful",
  "admin": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@vamana.com",
    "role": "admin"
  }
}
```

### Using Postman:

1. Method: POST
2. URL: `http://localhost:5000/api/admin/login`
3. Body (form-data):
   - email: `admin@vamana.com`
   - password: `admin123`

## 🔐 Security Notes

⚠️ **Current Implementation (Development Only)**
- Passwords stored in plain text
- No JWT tokens
- Simple cookie authentication

🔒 **For Production, Add:**
- bcrypt for password hashing
- JWT tokens for authentication
- Refresh tokens
- Rate limiting
- HTTPS only cookies
- Password validation rules

## 📝 Adding More API Endpoints

Follow the same pattern for other endpoints:

### 1. Create API function (Authapi.js)
```javascript
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data, { rejectWithValue }) => {
    const url = baseUrl + 'signup';
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
```

### 2. Add to slice (Authslice.js)
```javascript
builder.addCase(signUp.pending, (state) => {
  state.loading = true;
})
builder.addCase(signUp.fulfilled, (state, action) => {
  state.signupData = action.payload;
  state.loading = false;
})
builder.addCase(signUp.rejected, (state) => {
  state.loading = false;
})
```

### 3. Create backend route and controller
```javascript
// Controller
exports.signupAdmin = async (req, res) => {
  // Implementation
};

// Route
router.post("/signup", upload.any(), authController.signupAdmin);
```

## ✅ Everything is Ready!

Your admin authentication system is fully set up and ready to use. Just:
1. Create admin user
2. Start backend server
3. Start admin panel
4. Login and start managing your perfume shop!
