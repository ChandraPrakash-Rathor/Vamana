import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchReviews, 
  fetchFeaturedReviews, 
  fetchReviewsByProduct, 
  fetchReviewById,
  fetchBestReviewedProducts
} from '../apis/ReviewApi';

const initialState = {
  reviews: [],
  featuredReviews: [],
  bestReviewedProducts: [],
  currentReview: null,
  loading: false,
  error: null
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentReview: (state, action) => {
      state.currentReview = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reviews';
      })

      // Fetch featured reviews
      .addCase(fetchFeaturedReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredReviews = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchFeaturedReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch featured reviews';
      })

      // Fetch reviews by product
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reviews';
      })

      // Fetch single review
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReview = action.payload.data;
        state.error = null;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch review';
      })

      // Fetch best reviewed products
      .addCase(fetchBestReviewedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestReviewedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.bestReviewedProducts = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchBestReviewedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch best reviewed products';
      });
  }
});

export const { clearError, setCurrentReview } = reviewSlice.actions;
export default reviewSlice.reducer;
