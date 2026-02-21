import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import { baseUrl } from './config';

// Insert/Create Limited Offer
export const insertLimitedOffer = createAsyncThunk(
  'insertLimitedOffer',
  async (data) => {
    let url = baseUrl + 'insertLimitedOffer';
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

// Get All Limited Offers
export const GetLimitedOffers = createAsyncThunk(
  'GetLimitedOffers',
  async () => {
    let url = baseUrl + 'GetLimitedOffers';
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

// Get Limited Offer by ID
export const GetLimitedOfferById = createAsyncThunk(
  'GetLimitedOfferById',
  async (id) => {
    let url = baseUrl + `limited-offers/${id}`;
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

// Update Limited Offer
export const UpdateLimitedOffer = createAsyncThunk(
  'UpdateLimitedOffer',
  async ({ id, data }) => {
    let url = baseUrl + `limited-offers/${id}`;
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

// Delete Limited Offer
export const DeleteLimitedOffer = createAsyncThunk(
  'DeleteLimitedOffer',
  async (id) => {
    let url = baseUrl + `limited-offers/${id}`;
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

// Get Limited Offer Statistics
export const GetLimitedOfferStats = createAsyncThunk(
  'GetLimitedOfferStats',
  async () => {
    let url = baseUrl + 'limited-offers/stats';
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
