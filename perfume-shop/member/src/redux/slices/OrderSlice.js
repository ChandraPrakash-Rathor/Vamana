import { createSlice } from '@reduxjs/toolkit';
import { createOrder, verifyPayment } from '../apis/OrderApi';

const initialState = {
  currentOrder: null,
  orders: [],
  loading: false,
  error: null,
  paymentSuccess: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPaymentSuccess: (state) => {
      state.paymentSuccess = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSuccess = action.payload.success;
        if (action.payload.success) {
          state.orders.push(state.currentOrder);
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentSuccess = false;
      });
  }
});

export const { clearError, clearPaymentSuccess, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
