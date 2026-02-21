import { createSlice } from '@reduxjs/toolkit'
import { insertCoupon, GetCoupons, GetCouponById, UpdateCoupon, DeleteCoupon, ValidateCoupon, GetCouponStats } from '../apis/CouponApi'

const initialState = {
  loading: false,
  couponData: [],
  selectedCoupon: null,
  couponStats: null,
  validationResult: null,
}

export const CouponSlice = createSlice({
  name: 'CouponSlice',
  initialState,
  reducers: {
    clearSelectedCoupon: (state) => {
      state.selectedCoupon = null;
    },
    clearValidationResult: (state) => {
      state.validationResult = null;
    }
  },
  extraReducers: (builder) => {
    // insertCoupon cases
    builder.addCase(insertCoupon.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(insertCoupon.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(insertCoupon.rejected, (state) => {
      state.loading = false;
    })

    // GetCoupons cases
    builder.addCase(GetCoupons.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(GetCoupons.fulfilled, (state, action) => {
      state.loading = false;
      state.couponData = action.payload?.data;
    })
    builder.addCase(GetCoupons.rejected, (state) => {
      state.loading = false;
    })

    // GetCouponById cases
    builder.addCase(GetCouponById.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(GetCouponById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedCoupon = action.payload?.data;
    })
    builder.addCase(GetCouponById.rejected, (state) => {
      state.loading = false;
    })

    // UpdateCoupon cases
    builder.addCase(UpdateCoupon.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(UpdateCoupon.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(UpdateCoupon.rejected, (state) => {
      state.loading = false;
    })

    // DeleteCoupon cases
    builder.addCase(DeleteCoupon.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(DeleteCoupon.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(DeleteCoupon.rejected, (state) => {
      state.loading = false;
    })

    // ValidateCoupon cases
    builder.addCase(ValidateCoupon.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(ValidateCoupon.fulfilled, (state, action) => {
      state.loading = false;
      state.validationResult = action.payload?.data;
    })
    builder.addCase(ValidateCoupon.rejected, (state) => {
      state.loading = false;
      state.validationResult = null;
    })

    // GetCouponStats cases
    builder.addCase(GetCouponStats.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(GetCouponStats.fulfilled, (state, action) => {
      state.loading = false;
      state.couponStats = action.payload?.data;
    })
    builder.addCase(GetCouponStats.rejected, (state) => {
      state.loading = false;
    })
  },
})

export const { clearSelectedCoupon, clearValidationResult } = CouponSlice.actions

export default CouponSlice.reducer
