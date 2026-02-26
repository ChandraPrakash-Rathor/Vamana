import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from './config';

// Get all active sales
export const GetActiveSales = createAsyncThunk(
  'GetActiveSales',
  async () => {
    let url = baseUrl + 'sales';
    try {
      const response = (await axios.get(url)).data;
      if (response.success === true) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

// Get sale by ID
export const GetSaleById = createAsyncThunk(
  'GetSaleById',
  async (id) => {
    let url = baseUrl + `sales/${id}`;
    try {
      const response = (await axios.get(url)).data;
      if (response.success === true) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
);
