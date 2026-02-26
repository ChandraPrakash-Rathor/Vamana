import { createSlice } from '@reduxjs/toolkit';
import {
  GetActiveLimitedOffers,
  GetLimitedOfferById
} from '../apis/LimitedOfferApi';

const initialState = {
  loading: false,
  offers: [],
  currentOffer: null,
  error: null
};

export const LimitedOfferSlice = createSlice({
  name: 'LimitedOfferSlice',
  initialState,
  reducers: {
    clearCurrentOffer: (state) => {
      state.currentOffer = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // GetActiveLimitedOffers cases
    builder.addCase(GetActiveLimitedOffers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetActiveLimitedOffers.fulfilled, (state, action) => {
      state.loading = false;
      state.offers = action.payload?.data || [];
    });
    builder.addCase(GetActiveLimitedOffers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // GetLimitedOfferById cases
    builder.addCase(GetLimitedOfferById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetLimitedOfferById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentOffer = action.payload?.data || null;
    });
    builder.addCase(GetLimitedOfferById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});

export const { clearCurrentOffer, clearError } = LimitedOfferSlice.actions;
export default LimitedOfferSlice.reducer;
