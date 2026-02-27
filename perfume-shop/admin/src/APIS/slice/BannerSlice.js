import { createSlice } from '@reduxjs/toolkit';
import { fetchBanners, fetchBannerById, createBanner, updateBanner } from '../apis/BannerApi';

const initialState = {
  banners: [],
  currentBanner: null,
  loading: false,
  error: null,
  success: false
};

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
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
      })

      // Create banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload.data);
        state.success = true;
        state.error = null;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create banner';
        state.success = false;
      })

      // Update banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(b => b._id === action.payload.data._id);
        if (index !== -1) {
          state.banners[index] = action.payload.data;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update banner';
        state.success = false;
      });
  }
});

export const { clearError, clearSuccess, setCurrentBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
