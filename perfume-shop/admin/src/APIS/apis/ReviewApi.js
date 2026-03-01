import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from './Authapi'; // Import authenticated api instance

// Get all reviews
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('GetReviews');
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
      const response = await api.get(`GetReview/${id}`);
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
      const response = await api.post('insertReview', formData, {
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
      const response = await api.put(`updateReview/${id}`, formData, {
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
      await api.delete(`deleteReview/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);
