import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { baseUrl } from './config';

// const API_URL = 'https://admin.vamana.store/api/admin/themes';

const API_URL = `${baseUrl}themes`;
// Get token from Cookies (admin uses cookies, not localStorage)
const getAuthToken = () => {
  return Cookies.get('authToken');
};

// Get all themes
export const getAllThemes = createAsyncThunk(
  'theme/getAllThemes',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch themes' }
      );
    }
  }
);

// Get active theme
export const getActiveTheme = createAsyncThunk(
  'theme/getActiveTheme',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/active`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch active theme' }
      );
    }
  }
);

// Activate theme
export const activateTheme = createAsyncThunk(
  'theme/activateTheme',
  async (themeId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_URL}/${themeId}/activate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to activate theme' }
      );
    }
  }
);

// Create theme
export const createTheme = createAsyncThunk(
  'theme/createTheme',
  async (themeData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(API_URL, themeData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to create theme' }
      );
    }
  }
);

// Update theme
export const updateTheme = createAsyncThunk(
  'theme/updateTheme',
  async ({ id, themeData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(`${API_URL}/${id}`, themeData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update theme' }
      );
    }
  }
);

// Delete theme
export const deleteTheme = createAsyncThunk(
  'theme/deleteTheme',
  async (themeId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API_URL}/${themeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to delete theme' }
      );
    }
  }
);
