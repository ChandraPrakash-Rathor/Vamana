import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from './Authapi'; // Use authenticated api instance

export const insertProduct = createAsyncThunk(
  'insertProduct',
  async (data) => {
    try {
      const response = await api.post('insertProduct', data);
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

export const GetProduct = createAsyncThunk(
  'GetProduct',
  async () => {
    try {
      const response = await api.get('GetProducts');
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

export const DeleteProduct = createAsyncThunk(
  'DeleteProduct',
  async (id) => {
    try {
      const response = await api.delete(`products/${id}`);
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);

export const UpdateProduct = createAsyncThunk(
  'UpdateProduct',
  async ({ id, data }) => {
    try {
      const response = await api.put(`products/${id}`, data);
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err.response?.data || err.message);
    }
  }
);
