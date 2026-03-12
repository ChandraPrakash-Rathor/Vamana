import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './Authapi';

// Get all orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    try {
      const response = await api.get('GetOrders');
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

// Get order stats
export const fetchOrderStats = createAsyncThunk(
  'orders/fetchOrderStats',
  async () => {
    try {
      const response = await api.get('orders/stats');
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, paymentStatus, trackingStatus }) => {
    try {
      const updateData = {};
      if (paymentStatus) updateData.paymentStatus = paymentStatus;
      if (trackingStatus) updateData.trackingStatus = trackingStatus;
      
      const response = await api.put(`orders/${id}`, updateData);
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id) => {
    try {
      const response = await api.delete(`orders/${id}`);
      return Promise.resolve(id);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);
