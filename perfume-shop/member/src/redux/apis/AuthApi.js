import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from './config';

// Create axios instance with interceptor for token
const api = axios.create({
  baseURL: baseUrl
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('memberToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't automatically clear localStorage - let the app handle it
      // This prevents race conditions where token is being set while a request is in flight
      // window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Check Phone Number
export const checkPhone = createAsyncThunk(
  'auth/checkPhone',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}auth/check-phone`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to check phone' });
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}auth/register`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
  }
);

// Login User (removed - using checkPhone instead)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}auth/login`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

// Get Current User
export const getCurrentUser = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('auth/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user' });
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put('auth/profile', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update profile' });
    }
  }
);

// Logout User (client-side only)
export const logoutUser = () => {
  localStorage.removeItem('memberToken');
  localStorage.removeItem('isAuthenticated');
  sessionStorage.clear();
  window.location.href = '/';
};

// Export api instance for use in other API files
export { api };
