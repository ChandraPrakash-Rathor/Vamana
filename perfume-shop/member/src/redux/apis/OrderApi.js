import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/member';

// Create order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/create-order`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order');
    }
  }
);

// Verify payment
export const verifyPayment = createAsyncThunk(
  'order/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/verify-payment`, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Payment verification failed');
    }
  }
);
