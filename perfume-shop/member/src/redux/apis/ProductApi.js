import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from './config';


export const GetProducts = createAsyncThunk(
  'GetProducts',
  async () => {
    let url = baseUrl + 'products';
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


export const GetFeaturedProducts = createAsyncThunk(
  'GetFeaturedProducts',
  async () => {
    let url = baseUrl + 'products/featured';
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


export const GetBestsellerProducts = createAsyncThunk(
  'GetBestsellerProducts',
  async () => {
    let url = baseUrl + 'products/bestsellers';
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


export const GetTopRatedProducts = createAsyncThunk(
  'GetTopRatedProducts',
  async (limit = 8) => {
    let url = baseUrl + `products/top-rated?limit=${limit}`;
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


export const GetProductById = createAsyncThunk(
  'GetProductById',
  async (id) => {
    let url = baseUrl + `products/${id}`;
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


export const GetProductsByCategory = createAsyncThunk(
  'GetProductsByCategory',
  async (category) => {
    let url = baseUrl + `products/category/${category}`;
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
