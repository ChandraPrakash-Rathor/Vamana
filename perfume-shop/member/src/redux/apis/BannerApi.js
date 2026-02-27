import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from './config';

// Fetch all active banners
export const fetchBanners = createAsyncThunk(
  'banners/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}banners`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch banners');
    }
  }
);

// Fetch single banner by ID
export const fetchBannerById = createAsyncThunk(
  'banners/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}banners/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch banner');
    }
  }
);
