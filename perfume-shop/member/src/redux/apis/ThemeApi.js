import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/member/theme';

// Get active theme (public - no auth required)
export const getActiveTheme = createAsyncThunk(
  'theme/getActiveTheme',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/active`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch active theme' }
      );
    }
  }
);
