import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from './config';

// Get all reviews
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}GetReviews`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

// Get single review
export const fetchReviewById = createAsyncThunk(
  'reviews/fetchReviewById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}GetReview/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch review');
    }
  }
);

// Add new review
export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}insertReview`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add review');
    }
  }
);

// Update review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}updateReview/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

// Delete review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseUrl}deleteReview/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);
