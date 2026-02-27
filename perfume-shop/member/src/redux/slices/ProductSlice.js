import { createSlice } from '@reduxjs/toolkit';
import {
  GetProducts,
  GetFeaturedProducts,
  GetBestsellerProducts,
  GetTopRatedProducts,
  GetProductById,
  GetProductsByCategory
} from '../apis/ProductApi';

const initialState = {
  loading: false,
  products: [],
  featuredProducts: [],
  bestsellerProducts: [],
  topRatedProducts: [],
  currentProduct: null,
  categoryProducts: [],
  error: null
};

export const ProductSlice = createSlice({
  name: 'ProductSlice',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // GetProducts cases
    builder.addCase(GetProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload?.data || [];
    });
    builder.addCase(GetProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // GetFeaturedProducts cases
    builder.addCase(GetFeaturedProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetFeaturedProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.featuredProducts = action.payload?.data || [];
    });
    builder.addCase(GetFeaturedProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // GetBestsellerProducts cases
    builder.addCase(GetBestsellerProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetBestsellerProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.bestsellerProducts = action.payload?.data || [];
    });
    builder.addCase(GetBestsellerProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // GetTopRatedProducts cases
    builder.addCase(GetTopRatedProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetTopRatedProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.topRatedProducts = action.payload?.data || [];
    });
    builder.addCase(GetTopRatedProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // GetProductById cases
    builder.addCase(GetProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload?.data || null;
    });
    builder.addCase(GetProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // GetProductsByCategory cases
    builder.addCase(GetProductsByCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetProductsByCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categoryProducts = action.payload?.data || [];
    });
    builder.addCase(GetProductsByCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});

export const { clearCurrentProduct, clearError } = ProductSlice.actions;
export default ProductSlice.reducer;
