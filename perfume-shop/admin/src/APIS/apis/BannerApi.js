import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/admin/banners';

// Fetch all banners
export const fetchBanners = createAsyncThunk(
  'banners/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetBanners`);
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
      const response = await axios.get(`${API_BASE_URL}/GetBanner/${id}`);
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
      const response = await axios.post(`${API_BASE_URL}/CreateBanner`, formData, {
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
      const response = await axios.put(`${API_BASE_URL}/UpdateBanner/${id}`, formData, {
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
