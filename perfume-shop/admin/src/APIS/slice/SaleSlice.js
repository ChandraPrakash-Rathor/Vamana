import { createSlice } from '@reduxjs/toolkit'
import { insertSale, GetSales, GetSaleById, UpdateSale, DeleteSale, GetSaleStats, UpdateAllSaleStatuses } from '../apis/SaleApi'

const initialState = {
  loading: false,
  saleData: [],
  selectedSale: null,
  saleStats: null,
}

export const SaleSlice = createSlice({
  name: 'SaleSlice',
  initialState,
  reducers: {
    clearSelectedSale: (state) => {
      state.selectedSale = null;
    }
  },
  extraReducers: (builder) => {
    // insertSale cases
    builder.addCase(insertSale.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(insertSale.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(insertSale.rejected, (state) => {
      state.loading = false;
    })

    // GetSales cases
    builder.addCase(GetSales.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(GetSales.fulfilled, (state, action) => {
      state.loading = false;
      state.saleData = action.payload?.data;
    })
    builder.addCase(GetSales.rejected, (state) => {
      state.loading = false;
    })

    // GetSaleById cases
    builder.addCase(GetSaleById.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(GetSaleById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedSale = action.payload?.data;
    })
    builder.addCase(GetSaleById.rejected, (state) => {
      state.loading = false;
    })

    // UpdateSale cases
    builder.addCase(UpdateSale.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(UpdateSale.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(UpdateSale.rejected, (state) => {
      state.loading = false;
    })

    // DeleteSale cases
    builder.addCase(DeleteSale.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(DeleteSale.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(DeleteSale.rejected, (state) => {
      state.loading = false;
    })

    // GetSaleStats cases
    builder.addCase(GetSaleStats.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(GetSaleStats.fulfilled, (state, action) => {
      state.loading = false;
      state.saleStats = action.payload?.data;
    })
    builder.addCase(GetSaleStats.rejected, (state) => {
      state.loading = false;
    })

    // UpdateAllSaleStatuses cases
    builder.addCase(UpdateAllSaleStatuses.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(UpdateAllSaleStatuses.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(UpdateAllSaleStatuses.rejected, (state) => {
      state.loading = false;
    })
  },
})

export const { clearSelectedSale } = SaleSlice.actions

export default SaleSlice.reducer
