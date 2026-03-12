import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from './config';

// const API_URL = 'https://vamana.store/api/member/theme';
const API_URL = baseUrl;

// Get active theme (public - no auth required)
export const getActiveTheme = createAsyncThunk(
  'theme/getActiveTheme',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}theme/active`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch active theme' }
      );
    }
  }
);
