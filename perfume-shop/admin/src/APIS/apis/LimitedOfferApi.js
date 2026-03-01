import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from './Authapi'; // Import authenticated api instance

// Insert/Create Limited Offer
export const insertLimitedOffer = createAsyncThunk(
  'insertLimitedOffer',
  async (data) => {
    try {
      const response = await api.post('insertLimitedOffer', data);
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

// Get All Limited Offers
export const GetLimitedOffers = createAsyncThunk(
  'GetLimitedOffers',
  async () => {
    try {
      const response = await api.get('GetLimitedOffers');
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

// Get Limited Offer by ID
export const GetLimitedOfferById = createAsyncThunk(
  'GetLimitedOfferById',
  async (id) => {
    try {
      const response = await api.get(`limited-offers/${id}`);
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

// Update Limited Offer
export const UpdateLimitedOffer = createAsyncThunk(
  'UpdateLimitedOffer',
  async ({ id, data }) => {
    try {
      const response = await api.put(`limited-offers/${id}`, data);
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

// Delete Limited Offer
export const DeleteLimitedOffer = createAsyncThunk(
  'DeleteLimitedOffer',
  async (id) => {
    try {
      const response = await api.delete(`limited-offers/${id}`);
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

// Get Limited Offer Statistics
export const GetLimitedOfferStats = createAsyncThunk(
  'GetLimitedOfferStats',
  async () => {
    try {
      const response = await api.get('limited-offers/stats');
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
