import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from './Authapi'; // Import authenticated api instance

// Insert/Create Sale
export const insertSale = createAsyncThunk(
  'insertSale',
  async (data) => {
    try {
      const response = await api.post('insertSale', data);
      if (response.data.status === "success") {
        return Promise.resolve(response.data)
      } else if (response.data.status === "error") {
        return Promise.resolve(response.data)
      } else {
        return Promise.reject(response.data)
      }
    } catch (err) {
      return Promise.reject(err)
    }
  },
);

// Get All Sales
export const GetSales = createAsyncThunk(
  'GetSales',
  async () => {
    try {
      const response = await api.get('GetSales');
      if (response.data.status === "success") {
        return Promise.resolve(response.data)
      } else if (response.data.status === "error") {
        return Promise.resolve(response.data)
      } else {
        return Promise.reject(response.data)
      }
    } catch (err) {
      return Promise.reject(err)
    }
  },
);

// Get Sale by ID
export const GetSaleById = createAsyncThunk(
  'GetSaleById',
  async (id) => {
    try {
      const response = await api.get(`sales/${id}`);
      if (response.data.status === "success") {
        return Promise.resolve(response.data)
      } else if (response.data.status === "error") {
        return Promise.resolve(response.data)
      } else {
        return Promise.reject(response.data)
      }
    } catch (err) {
      return Promise.reject(err)
    }
  },
);

// Update Sale
export const UpdateSale = createAsyncThunk(
  'UpdateSale',
  async ({ id, data }) => {
    try {
      const response = await api.put(`sales/${id}`, data);
      if (response.data.status === "success") {
        return Promise.resolve(response.data)
      } else if (response.data.status === "error") {
        return Promise.resolve(response.data)
      } else {
        return Promise.reject(response.data)
      }
    } catch (err) {
      return Promise.reject(err)
    }
  },
);

// Delete Sale
export const DeleteSale = createAsyncThunk(
  'DeleteSale',
  async (id) => {
    try {
      const response = await api.delete(`sales/${id}`);
      if (response.data.status === "success") {
        return Promise.resolve(response.data)
      } else if (response.data.status === "error") {
        return Promise.resolve(response.data)
      } else {
        return Promise.reject(response.data)
      }
    } catch (err) {
      return Promise.reject(err)
    }
  },
);

// Get Sale Statistics
export const GetSaleStats = createAsyncThunk(
  'GetSaleStats',
  async () => {
    try {
      const response = await api.get('sales/stats');
      if (response.data.status === "success") {
        return Promise.resolve(response.data)
      } else if (response.data.status === "error") {
        return Promise.resolve(response.data)
      } else {
        return Promise.reject(response.data)
      }
    } catch (err) {
      return Promise.reject(err)
    }
  },
);

// Update All Sale Statuses
export const UpdateAllSaleStatuses = createAsyncThunk(
  'UpdateAllSaleStatuses',
  async () => {
    try {
      const response = await api.post('sales/update-statuses');
      if (response.data.status === "success") {
        return Promise.resolve(response.data)
      } else if (response.data.status === "error") {
        return Promise.resolve(response.data)
      } else {
        return Promise.reject(response.data)
      }
    } catch (err) {
      return Promise.reject(err)
    }
  },
);
