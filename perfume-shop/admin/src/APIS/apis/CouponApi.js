import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from './Authapi'; // Import authenticated api instance

// Insert/Create Coupon
export const insertCoupon = createAsyncThunk(
  'insertCoupon',
  async (data) => {
    try {
      const response = await api.post('insertCoupon', data);
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

// Get All Coupons
export const GetCoupons = createAsyncThunk(
  'GetCoupons',
  async () => {
    try {
      const response = await api.get('GetCoupons');
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

// Get Coupon by ID
export const GetCouponById = createAsyncThunk(
  'GetCouponById',
  async (id) => {
    try {
      const response = await api.get(`coupons/${id}`);
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

// Update Coupon
export const UpdateCoupon = createAsyncThunk(
  'UpdateCoupon',
  async ({ id, data }) => {
    try {
      const response = await api.put(`coupons/${id}`, data);
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

// Delete Coupon
export const DeleteCoupon = createAsyncThunk(
  'DeleteCoupon',
  async (id) => {
    try {
      const response = await api.delete(`coupons/${id}`);
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

// Validate Coupon
export const ValidateCoupon = createAsyncThunk(
  'ValidateCoupon',
  async (data) => {
    try {
      const response = await api.post('coupons/validate', data);
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

// Get Coupon Statistics
export const GetCouponStats = createAsyncThunk(
  'GetCouponStats',
  async () => {
    try {
      const response = await api.get('coupons/stats');
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
