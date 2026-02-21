import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import { baseUrl } from './config';

// Insert/Create Coupon
export const insertCoupon = createAsyncThunk(
  'insertCoupon',
  async (data) => {
    let url = baseUrl + 'insertCoupon';
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

// Get All Coupons
export const GetCoupons = createAsyncThunk(
  'GetCoupons',
  async () => {
    let url = baseUrl + 'GetCoupons';
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

// Get Coupon by ID
export const GetCouponById = createAsyncThunk(
  'GetCouponById',
  async (id) => {
    let url = baseUrl + `coupons/${id}`;
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

// Update Coupon
export const UpdateCoupon = createAsyncThunk(
  'UpdateCoupon',
  async ({ id, data }) => {
    let url = baseUrl + `coupons/${id}`;
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

// Delete Coupon
export const DeleteCoupon = createAsyncThunk(
  'DeleteCoupon',
  async (id) => {
    let url = baseUrl + `coupons/${id}`;
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

// Validate Coupon
export const ValidateCoupon = createAsyncThunk(
  'ValidateCoupon',
  async (data) => {
    let url = baseUrl + 'coupons/validate';
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

// Get Coupon Statistics
export const GetCouponStats = createAsyncThunk(
  'GetCouponStats',
  async () => {
    let url = baseUrl + 'coupons/stats';
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
