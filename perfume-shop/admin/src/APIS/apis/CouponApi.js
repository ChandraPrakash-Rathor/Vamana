import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from './Authapi';

const resolve = (response) => Promise.resolve(response.data);
const reject = (err) => Promise.reject(err.response?.data || err.message);

export const insertCoupon = createAsyncThunk('insertCoupon', async (data) => {
  try { return resolve(await api.post('insertCoupon', data)); } catch (err) { return reject(err); }
});

export const GetCoupons = createAsyncThunk('GetCoupons', async () => {
  try { return resolve(await api.get('GetCoupons')); } catch (err) { return reject(err); }
});

export const GetCouponById = createAsyncThunk('GetCouponById', async (id) => {
  try { return resolve(await api.get(`coupons/${id}`)); } catch (err) { return reject(err); }
});

export const UpdateCoupon = createAsyncThunk('UpdateCoupon', async ({ id, data }) => {
  try { return resolve(await api.put(`coupons/${id}`, data)); } catch (err) { return reject(err); }
});

export const DeleteCoupon = createAsyncThunk('DeleteCoupon', async (id) => {
  try { return resolve(await api.delete(`coupons/${id}`)); } catch (err) { return reject(err); }
});

export const ValidateCoupon = createAsyncThunk('ValidateCoupon', async (data) => {
  try { return resolve(await api.post('coupons/validate', data)); } catch (err) { return reject(err); }
});

export const GetCouponStats = createAsyncThunk('GetCouponStats', async () => {
  try { return resolve(await api.get('coupons/stats')); } catch (err) { return reject(err); }
});
