import { createSlice } from '@reduxjs/toolkit';
import { getActiveCoupons, validateCoupon } from '../apis/CouponApi';

const initialState = {
  coupons: [],
  appliedCoupon: null,
  loading: false,
  error: null,
  success: null
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    // Get Active Coupons
    builder
      .addCase(getActiveCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.data || [];
      })
      .addCase(getActiveCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch coupons';
      });

    // Validate Coupon
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.coupon;
        state.success = action.payload.message;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to validate coupon';
        state.appliedCoupon = null;
      });
  }
});

export const { clearError, clearSuccess, removeCoupon } = couponSlice.actions;
export default couponSlice.reducer;
