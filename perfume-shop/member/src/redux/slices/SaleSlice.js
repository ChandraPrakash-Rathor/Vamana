import { createSlice } from '@reduxjs/toolkit';
import {
  GetActiveSales,
  GetSaleById
} from '../apis/SaleApi';

const initialState = {
  loading: false,
  sales: [],
  currentSale: null,
  error: null
};

export const SaleSlice = createSlice({
  name: 'SaleSlice',
  initialState,
  reducers: {
    clearCurrentSale: (state) => {
      state.currentSale = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // GetActiveSales cases
    builder.addCase(GetActiveSales.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetActiveSales.fulfilled, (state, action) => {
      state.loading = false;
      state.sales = action.payload?.data || [];
    });
    builder.addCase(GetActiveSales.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // GetSaleById cases
    builder.addCase(GetSaleById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetSaleById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentSale = action.payload?.data || null;
    });
    builder.addCase(GetSaleById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});

export const { clearCurrentSale, clearError } = SaleSlice.actions;
export default SaleSlice.reducer;
