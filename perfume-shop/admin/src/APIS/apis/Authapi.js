import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import { baseUrl } from './config';
import Cookies from "js-cookie";

// Create axios instance with interceptor for token
const api = axios.create({
  baseURL: baseUrl
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
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
      // Token expired or invalid
      Cookies.remove('authToken');
      Cookies.remove('isAuthenticate');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data) => {
    try {
      const response = await axios.post(baseUrl + 'login', data);
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async () => {
    try {
      const response = await api.get('auth/me');
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data) => {
    try {
      const response = await api.put('auth/profile', data);
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data) => {
    try {
      const response = await api.put('auth/change-password', data);
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

export const getAllAdmins = createAsyncThunk(
  'auth/getAllAdmins',
  async () => {
    try {
      const response = await api.get('auth/admins');
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

export const createNewAdmin = createAsyncThunk(
  'auth/createNewAdmin',
  async (data) => {
    try {
      const response = await api.post('auth/create', data);
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  'auth/deleteAdmin',
  async (id) => {
    try {
      const response = await api.delete(`auth/admins/${id}`);
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

// Logout function (client-side only, no API call needed)
export const logoutUser = () => {
  // Clear all auth cookies
  Cookies.remove('authToken');
  Cookies.remove('isAuthenticate');
  
  // Clear any other stored data
  localStorage.clear();
  sessionStorage.clear();
  
  // Redirect to login
  window.location.href = '/login';
};

// Export api instance for use in other API files
export { api };
