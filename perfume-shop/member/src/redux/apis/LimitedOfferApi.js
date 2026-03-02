import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from './config';


export const GetActiveLimitedOffers = createAsyncThunk(
  'GetActiveLimitedOffers',
  async () => {
    let url = baseUrl + 'limited-offers';
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


export const GetLimitedOfferById = createAsyncThunk(
  'GetLimitedOfferById',
  async (id) => {
    let url = baseUrl + `limited-offers/${id}`;
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
