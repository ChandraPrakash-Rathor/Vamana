import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './AuthApi';
import axios from 'axios';
import { baseUrl } from './config';

// Get all active coupons
export const getActiveCoupons = createAsyncThunk(
  'coupon/getActiveCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}coupons`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch coupons' });
    }
  }
);

// Validate and apply coupon
export const validateCoupon = createAsyncThunk(
  'coupon/validateCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await api.post('coupons/validate', { couponCode });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to validate coupon' });
    }
  }
);
