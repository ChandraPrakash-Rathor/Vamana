import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './AuthApi';

// Add order
export const Orderinsert = createAsyncThunk(
  "order/create",
  async (data, { rejectWithValue }) => {
    try {

      const response = await api.post(
        "create-order",
        data
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data || {
          message: "Order creation failed"
        }
      );

    }
  }
);

