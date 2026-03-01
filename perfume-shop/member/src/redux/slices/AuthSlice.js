import { createSlice } from '@reduxjs/toolkit';
import { checkPhone, registerUser, loginUser, getCurrentUser, updateProfile } from '../apis/AuthApi';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  success: null,
  phoneExists: null, // Track if phone exists for registration flow
  pendingPhone: null // Store phone number during registration
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearPhoneCheck: (state) => {
      state.phoneExists = null;
      state.pendingPhone = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.phoneExists = null;
      state.pendingPhone = null;
      localStorage.removeItem('memberToken');
      localStorage.removeItem('isAuthenticated');
    }
  },
  extraReducers: (builder) => {
    // Check Phone
    builder
      .addCase(checkPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPhone.fulfilled, (state, action) => {
        state.loading = false;
        console.log('CheckPhone Response:', action.payload); // Debug log
        if (action.payload.exists) {
          // Phone exists - auto login
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.success = action.payload.message;
          if (action.payload.token) {
            console.log('Setting token in localStorage:', action.payload.token); // Debug log
            // Store token in localStorage (more reliable than cookies for SPAs)
            localStorage.setItem('memberToken', action.payload.token);
            localStorage.setItem('isAuthenticated', 'true');
            console.log('Token stored, verifying:', localStorage.getItem('memberToken')); // Verify
          } else {
            console.error('No token in checkPhone response!'); // Debug log
          }
        } else {
          // Phone doesn't exist - need registration
          state.phoneExists = false;
          state.pendingPhone = action.payload.phone;
          state.success = null;
        }
      })
      .addCase(checkPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to check phone';
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Register Response:', action.payload); // Debug log
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.success = action.payload.message;
        state.phoneExists = null;
        state.pendingPhone = null;
        // Store token in localStorage
        if (action.payload.token) {
          console.log('Setting token in localStorage:', action.payload.token); // Debug log
          localStorage.setItem('memberToken', action.payload.token);
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          console.error('No token in response!'); // Debug log
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.success = action.payload.message;
        // Store token in localStorage
        localStorage.setItem('memberToken', action.payload.token);
        localStorage.setItem('isAuthenticated', 'true');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      });
  }
});

export const { clearError, clearSuccess, clearPhoneCheck, logout } = authSlice.actions;
export default authSlice.reducer;
