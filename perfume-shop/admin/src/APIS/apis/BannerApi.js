import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './Authapi'; // Import authenticated api instance

const API_BASE_URL = '/banners'; // Relative path since baseURL is already set

// Fetch all banners
export const fetchBanners = createAsyncThunk(
  'banners/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/GetBanners`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch banners');
    }
  }
);

// Fetch single banner
export const fetchBannerById = createAsyncThunk(
  'banners/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/GetBanner/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch banner');
    }
  }
);

// Create banner
export const createBanner = createAsyncThunk(
  'banners/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}/CreateBanner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create banner');
    }
  }
);

// Update banner
export const updateBanner = createAsyncThunk(
  'banners/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_BASE_URL}/UpdateBanner/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update banner');
    }
  }
);
