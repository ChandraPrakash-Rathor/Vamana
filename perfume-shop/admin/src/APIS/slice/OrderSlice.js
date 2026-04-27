import { createSlice } from '@reduxjs/toolkit';
import { fetchOrders, fetchOrderStats, updateOrderStatus, deleteOrder } from '../apis/OrderApi';

const initialState = {
  orders: [],
  stats: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        // API returns {success, message, data:[]} — safely extract array
        const payload = action.payload;
        state.orders = Array.isArray(payload) ? payload
          : Array.isArray(payload?.data) ? payload.data
          : [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Stats
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        // API returns {success, message, data:{...}} — extract data
        const payload = action.payload;
        state.stats = payload?.data || payload || null;
      })
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload.order };
        }
      })
      // Delete Order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(o => o._id !== action.payload);
      });
  }
});

export default orderSlice.reducer;
