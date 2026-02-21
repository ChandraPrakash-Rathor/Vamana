import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import { baseUrl } from './config';

// Insert/Create Sale
export const insertSale = createAsyncThunk(
  'insertSale',
  async (data) => {
    let url = baseUrl + 'insertSale';
    try {
      const response = (await axios.post(url, data)).data
      if (response.status === "success") {
        return Promise.resolve(response)
      } else if (response.status === "error") {
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
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
    let url = baseUrl + 'GetSales';
    try {
      const response = (await axios.get(url)).data
      if (response.status === "success") {
        return Promise.resolve(response)
      } else if (response.status === "error") {
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
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
    let url = baseUrl + `sales/${id}`;
    try {
      const response = (await axios.get(url)).data
      if (response.status === "success") {
        return Promise.resolve(response)
      } else if (response.status === "error") {
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
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
    let url = baseUrl + `sales/${id}`;
    try {
      const response = (await axios.put(url, data)).data
      if (response.status === "success") {
        return Promise.resolve(response)
      } else if (response.status === "error") {
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
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
    let url = baseUrl + `sales/${id}`;
    try {
      const response = (await axios.delete(url)).data
      if (response.status === "success") {
        return Promise.resolve(response)
      } else if (response.status === "error") {
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
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
    let url = baseUrl + 'sales/stats';
    try {
      const response = (await axios.get(url)).data
      if (response.status === "success") {
        return Promise.resolve(response)
      } else if (response.status === "error") {
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
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
    let url = baseUrl + 'sales/update-statuses';
    try {
      const response = (await axios.post(url)).data
      if (response.status === "success") {
        return Promise.resolve(response)
      } else if (response.status === "error") {
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
      }
    } catch (err) {
      return Promise.reject(err)
    }
  },
);
