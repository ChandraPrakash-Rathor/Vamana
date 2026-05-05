import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from './Authapi';

const resolve = (response) => Promise.resolve(response.data);
const reject = (err) => Promise.reject(err.response?.data || err.message);

export const insertLimitedOffer = createAsyncThunk('insertLimitedOffer', async (data) => {
  try { return resolve(await api.post('insertLimitedOffer', data)); } catch (err) { return reject(err); }
});

export const GetLimitedOffers = createAsyncThunk('GetLimitedOffers', async () => {
  try { return resolve(await api.get('GetLimitedOffers')); } catch (err) { return reject(err); }
});

export const GetLimitedOfferById = createAsyncThunk('GetLimitedOfferById', async (id) => {
  try { return resolve(await api.get(`limited-offers/${id}`)); } catch (err) { return reject(err); }
});

export const UpdateLimitedOffer = createAsyncThunk('UpdateLimitedOffer', async ({ id, data }) => {
  try { return resolve(await api.put(`limited-offers/${id}`, data)); } catch (err) { return reject(err); }
});

export const DeleteLimitedOffer = createAsyncThunk('DeleteLimitedOffer', async (id) => {
  try { return resolve(await api.delete(`limited-offers/${id}`)); } catch (err) { return reject(err); }
});

export const GetLimitedOfferStats = createAsyncThunk('GetLimitedOfferStats', async () => {
  try { return resolve(await api.get('limited-offers/stats')); } catch (err) { return reject(err); }
});
