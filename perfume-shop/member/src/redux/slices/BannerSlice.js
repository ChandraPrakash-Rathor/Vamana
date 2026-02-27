import { createSlice } from '@reduxjs/toolkit';
import { fetchBanners, fetchBannerById } from '../apis/BannerApi';

const initialState = {
  banners: [],
  currentBanner: null,
  loading: false,
  error: null
};

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBanner: (state, action) => {
      state.currentBanner = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch banners';
      })

      // Fetch single banner
      .addCase(fetchBannerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBanner = action.payload.data;
        state.error = null;
      })
      .addCase(fetchBannerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch banner';
      });
  }
});

export const { clearError, setCurrentBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
