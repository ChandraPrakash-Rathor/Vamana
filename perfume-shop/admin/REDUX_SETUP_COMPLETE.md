# Redux Toolkit Setup - Complete ✅

## 📁 Folder Structure

Your Redux setup follows the exact pattern you requested:

```
admin/src/APIS/
├── apis/                    # API calls folder
│   ├── Authapi.js          # Authentication async thunks
│   └── config.js           # Base URL configuration
├── slice/                   # Redux slices folder
│   └── Authslice.js        # Auth state management
└── store/                   # Store folder
    └── store.js            # Redux store configuration
```

## 📦 Installed Packages

All required packages are already installed:

```json
{
  "@reduxjs/toolkit": "^2.11.2",
  "react-redux": "^9.2.0",
  "axios": "^1.13.5",
  "js-cookie": "^3.0.5",
  "react-toastify": "^11.0.5"
}
```

## 🔧 Configuration Files

### 1. config.js - Base URL
```javascript
export const baseUrl = 'http://localhost:5000/api/admin/';
```

### 2. Authapi.js - API Calls
```javascript
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import { baseUrl } from './config';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data) => {
    let url = baseUrl + 'login';
    try {
      const response = (await axios.post(url, data)).data
      if(response.status === "success"){
        return Promise.resolve(response)
      } else if(response.status === "error"){
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }
);
```

### 3. Authslice.js - State Management
```javascript
import { createSlice } from '@reduxjs/toolkit'
import { loginUser } from '../apis/Authapi'

const initialState = {
  companyLogo: '',
  loginData: '',
  loading: false,
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loginData = action.payload;
      state.loading = false;
    })
    builder.addCase(loginUser.rejected, (state) => {
      state.loading = false;
    })
  },
})

export default loginSlice.reducer
```

### 4. store.js - Redux Store
```javascript
import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../slice/Authslice'

export const store = configureStore({
  reducer: {
    AuthSlice: loginReducer,
  },
})
```

### 5. index.js - Provider Setup
```javascript
import { Provider } from "react-redux";
import { store } from "./APIS/store/store";
import { ToastContainer } from "react-toastify";

root.render(
  <React.StrictMode>
    <ToastContainer />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

## 🎯 How to Use in Components

### Login Page Example

```javascript
import { useDispatch } from 'react-redux';
import { loginUser } from '../APIS/apis/Authapi';
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async(data) => {
    // Create FormData
    const formData = new FormData();
    formData.append('email', data.username);
    formData.append('password', data.password);
    
    // Dispatch Redux action
    const res = await dispatch(loginUser(formData));
    
    // Handle response
    if(res?.payload?.status == "success"){
      toast.success("Login Successful!");
      Cookies.set("isAuthenticate", res?.payload?.success);
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  }
}
```

## 🔄 Adding New API Endpoints

Follow this pattern to add more endpoints:

### Step 1: Add to Authapi.js

```javascript
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data, { rejectWithValue }) => {
    const url = baseUrl + 'signup';
    try {
      const response = await axios.post(url, data);
      const resData = response.data;
      
      if (resData.status !== 'success') {
        return rejectWithValue(resData);
      }
      return resData;
    } catch (err) {
      const errorData = err?.response?.data || { 
        message: "Unknown error occurred" 
      };
      return rejectWithValue(errorData);
    }
  }
);

export const logOut = createAsyncThunk(
  'auth/logOut',
  async (data, { rejectWithValue }) => {
    const url = baseUrl + 'logout';
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
```

### Step 2: Update Authslice.js

```javascript
import { loginUser, signUp, logOut } from '../apis/Authapi'

const initialState = {
  companyLogo: '',
  loginData: '',
  signupData: [],
  loading: false,
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loginData = action.payload;
      state.loading = false;
    })
    builder.addCase(loginUser.rejected, (state) => {
      state.loading = false;
    })
    
    // Sign Up
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
    
    // Logout
    builder.addCase(logOut.pending, (state) => {
      state.loading = false;
    })
    builder.addCase(logOut.fulfilled, (state) => {
      state.loginData = '';
      state.loading = false;
    })
    builder.addCase(logOut.rejected, (state) => {
      state.loading = false;
    })
  },
})
```

### Step 3: Use in Component

```javascript
import { signUp } from '../APIS/apis/Authapi';

const handleSignup = async(data) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('password', data.password);
  
  const res = await dispatch(signUp(formData));
  
  if(res?.payload?.status == "success"){
    toast.success("Signup Successful!");
  } else {
    toast.error(res?.payload?.message || "Signup failed");
  }
}
```

## 🎨 Pattern Explanation

### Why This Pattern?

1. **Separation of Concerns**
   - `apis/` - All API calls in one place
   - `slice/` - State management logic
   - `store/` - Store configuration

2. **Reusability**
   - API functions can be used in multiple components
   - State is centralized and accessible everywhere

3. **Error Handling**
   - Consistent error handling with `rejectWithValue`
   - Loading states managed automatically

4. **Type Safety**
   - Clear action types with `createAsyncThunk`
   - Predictable state updates

### FormData vs JSON

Your pattern uses FormData for file uploads:

```javascript
// FormData (for file uploads)
const formData = new FormData();
formData.append('email', data.email);
formData.append('image', file);
axios.post(url, formData);

// JSON (for simple data)
axios.post(url, { email: data.email });
```

## 📊 State Structure

```javascript
{
  AuthSlice: {
    companyLogo: '',
    loginData: {
      status: 'success',
      success: true,
      message: 'Login successful',
   
      admin: {
        _id: '...',
        name: 'Admin User',
        email: 'admin@vamana.com',
        role: 'admin'
      }
    },
    signupData: [],
    loading: false
  }
}
```

## 🔍 Accessing State in Components

```javascript
import { useSelector } from 'react-redux';

function Dashboard() {
  // Access login data
  const loginData = useSelector(state => state.AuthSlice.loginData);
  const loading = useSelector(state => state.AuthSlice.loading);
  
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Welcome, {loginData?.admin?.name}</p>
      )}
    </div>
  );
}
```

## 🛡️ Protected Routes

```javascript
import Cookies from "js-cookie";
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticate = Cookies.get("isAuthenticate");
  
  if (!isAuthenticate) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Usage in App.js
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 🧪 Testing Redux

### 1. Check Redux DevTools
Install Redux DevTools extension in your browser to see:
- Current state
- Action history
- State changes

### 2. Console Logging
```javascript
const res = await dispatch(loginUser(formData));
console.log('Response:', res);
console.log('Payload:', res.payload);
console.log('Status:', res.payload?.status);
```

### 3. Check State
```javascript
import { useSelector } from 'react-redux';

const state = useSelector(state => state);
console.log('Full State:', state);
```

## 📝 Best Practices

1. **Always use FormData for backend calls**
   ```javascript
   const formData = new FormData();
   formData.append('key', value);
   ```

2. **Handle all response cases**
   ```javascript
   if(res?.payload?.status == "success"){
     // Success
   } else if(res?.payload?.status == "error"){
     // Error
   } else {
     // Unknown
   }
   ```

3. **Show loading states**
   ```javascript
   const loading = useSelector(state => state.AuthSlice.loading);
   {loading && <Loader />}
   ```

4. **Use toast notifications**
   ```javascript
   toast.success("Success!");
   toast.error("Error!");
   toast.info("Info!");
   ```

5. **Store auth in cookies**
   ```javascript
   Cookies.set("isAuthenticate", true);
   Cookies.get("isAuthenticate");
   Cookies.remove("isAuthenticate");
   ```

## 🚀 Next Steps

### For Product Management

Create `admin/src/APIS/apis/Productapi.js`:

```javascript
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import { baseUrl } from './config';

export const getAllProducts = createAsyncThunk(
  'product/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(baseUrl + 'products');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseUrl + 'products', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(baseUrl + `products/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(baseUrl + `products/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
```

Create `admin/src/APIS/slice/Productslice.js`:

```javascript
import { createSlice } from '@reduxjs/toolkit'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../apis/Productapi'

const initialState = {
  products: [],
  loading: false,
  error: null,
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Products
    builder.addCase(getAllProducts.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.products = action.payload.data;
      state.loading = false;
    })
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    // Create Product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.products.push(action.payload.data);
      state.loading = false;
    })
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    // Update Product
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const index = state.products.findIndex(p => p._id === action.payload.data._id);
      if (index !== -1) {
        state.products[index] = action.payload.data;
      }
    })
    
    // Delete Product
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(p => p._id !== action.meta.arg);
    })
  },
})

export default productSlice.reducer
```

Add to store:

```javascript
import productReducer from '../slice/Productslice'

export const store = configureStore({
  reducer: {
    AuthSlice: loginReducer,
    ProductSlice: productReducer,
  },
})
```

## ✅ Summary

Your Redux Toolkit setup is complete and follows your exact pattern:

- ✅ Folder structure: `APIS/apis/`, `APIS/slice/`, `APIS/store/`
- ✅ Config file with base URL
- ✅ Async thunks with proper error handling
- ✅ Redux slices with loading states
- ✅ Store configuration
- ✅ Provider setup in index.js
- ✅ Integration with Login page
- ✅ Toast notifications
- ✅ Cookie-based authentication

Everything is ready to use! Just start the backend server and login.
