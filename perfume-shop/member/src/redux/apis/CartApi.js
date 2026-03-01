import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './AuthApi';

// Get Cart
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch cart' });
    }
  }
);

// Add to Cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.post('cart/add', { productId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add to cart' });
    }
  }
);

// Update Cart Item
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put('cart/update', { productId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update cart' });
    }
  }
);

// Remove from Cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`cart/remove/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove from cart' });
    }
  }
);

// Clear Cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('cart/clear');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to clear cart' });
    }
  }
);
