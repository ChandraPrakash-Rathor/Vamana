import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from './config';

// Fetch all reviews
export const fetchReviews = createAsyncThunk(
  'reviews/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}reviews`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

// Fetch featured reviews (top rated)
export const fetchFeaturedReviews = createAsyncThunk(
  'reviews/fetchFeatured',
  async (limit = 6, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}reviews/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured reviews');
    }
  }
);

// Fetch reviews by product
export const fetchReviewsByProduct = createAsyncThunk(
  'reviews/fetchByProduct',
  async (productName, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}reviews/product/${productName}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

// Fetch single review by ID
export const fetchReviewById = createAsyncThunk(
  'reviews/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}reviews/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch review');
    }
  }
);

// Fetch products with best reviews (3+ reviews, 3+ rating)
export const fetchBestReviewedProducts = createAsyncThunk(
  'reviews/fetchBestProducts',
  async ({ limit = 8, minReviews = 3 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}reviews/best-products?limit=${limit}&minReviews=${minReviews}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch best reviewed products');
    }
  }
);
