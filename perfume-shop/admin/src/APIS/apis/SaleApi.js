import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from './Authapi';

const resolve = (response) => Promise.resolve(response.data);
const reject = (err) => Promise.reject(err.response?.data || err.message);

export const insertSale = createAsyncThunk('insertSale', async (data) => {
  try { return resolve(await api.post('insertSale', data)); } catch (err) { return reject(err); }
});

export const GetSales = createAsyncThunk('GetSales', async () => {
  try { return resolve(await api.get('GetSales')); } catch (err) { return reject(err); }
});

export const GetSaleById = createAsyncThunk('GetSaleById', async (id) => {
  try { return resolve(await api.get(`sales/${id}`)); } catch (err) { return reject(err); }
});

export const UpdateSale = createAsyncThunk('UpdateSale', async ({ id, data }) => {
  try { return resolve(await api.put(`sales/${id}`, data)); } catch (err) { return reject(err); }
});

export const DeleteSale = createAsyncThunk('DeleteSale', async (id) => {
  try { return resolve(await api.delete(`sales/${id}`)); } catch (err) { return reject(err); }
});

export const GetSaleStats = createAsyncThunk('GetSaleStats', async () => {
  try { return resolve(await api.get('sales/stats')); } catch (err) { return reject(err); }
});

export const UpdateAllSaleStatuses = createAsyncThunk('UpdateAllSaleStatuses', async () => {
  try { return resolve(await api.post('sales/update-statuses')); } catch (err) { return reject(err); }
});
