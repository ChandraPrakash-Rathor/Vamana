import { createSlice } from '@reduxjs/toolkit';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../apis/CartApi';

const initialState = {
  cart: null,
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null,
  success: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    resetCart: (state) => {
      state.cart = null;
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    }
  },
  extraReducers: (builder) => {
    // Get Cart
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.items = action.payload.cart?.items || [];
        state.totalAmount = action.payload.cart?.totalAmount || 0;
        state.totalItems = action.payload.cart?.totalItems || 0;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch cart';
      });

    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.items = action.payload.cart?.items || [];
        state.totalAmount = action.payload.cart?.totalAmount || 0;
        state.totalItems = action.payload.cart?.totalItems || 0;
        state.success = action.payload.message;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add to cart';
      });

    // Update Cart Item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.items = action.payload.cart?.items || [];
        state.totalAmount = action.payload.cart?.totalAmount || 0;
        state.totalItems = action.payload.cart?.totalItems || 0;
        state.success = action.payload.message;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update cart';
      });

    // Remove from Cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.items = action.payload.cart?.items || [];
        state.totalAmount = action.payload.cart?.totalAmount || 0;
        state.totalItems = action.payload.cart?.totalItems || 0;
        state.success = action.payload.message;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove from cart';
      });

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0;
        state.success = action.payload.message;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to clear cart';
      });
  }
});

export const { clearError, clearSuccess, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
