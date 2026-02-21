import { createSlice } from '@reduxjs/toolkit'
import { 
  insertLimitedOffer, 
  GetLimitedOffers, 
  GetLimitedOfferById,
  UpdateLimitedOffer,
  DeleteLimitedOffer,
  GetLimitedOfferStats
} from '../apis/LimitedOfferApi'

const initialState = {
  loading: false,
  limitedOfferData: [],
  stats: null
}

export const LimitedOfferSlice = createSlice({
  name: 'LimitedOfferSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // insertLimitedOffer cases
    builder.addCase(insertLimitedOffer.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(insertLimitedOffer.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(insertLimitedOffer.rejected, (state) => {
      state.loading = false;
    })

    // GetLimitedOffers cases
    builder.addCase(GetLimitedOffers.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(GetLimitedOffers.fulfilled, (state, action) => {
      state.loading = false;
      state.limitedOfferData = action.payload?.data;
    })
    builder.addCase(GetLimitedOffers.rejected, (state) => {
      state.loading = false;
    })

    // GetLimitedOfferById cases
    builder.addCase(GetLimitedOfferById.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(GetLimitedOfferById.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(GetLimitedOfferById.rejected, (state) => {
      state.loading = false;
    })

    // UpdateLimitedOffer cases
    builder.addCase(UpdateLimitedOffer.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(UpdateLimitedOffer.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(UpdateLimitedOffer.rejected, (state) => {
      state.loading = false;
    })

    // DeleteLimitedOffer cases
    builder.addCase(DeleteLimitedOffer.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(DeleteLimitedOffer.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(DeleteLimitedOffer.rejected, (state) => {
      state.loading = false;
    })

    // GetLimitedOfferStats cases
    builder.addCase(GetLimitedOfferStats.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(GetLimitedOfferStats.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload?.data;
    })
    builder.addCase(GetLimitedOfferStats.rejected, (state) => {
      state.loading = false;
    })
  },
})

export default LimitedOfferSlice.reducer
