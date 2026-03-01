import { createSlice } from "@reduxjs/toolkit";
import { Orderinsert } from "../apis/OrderApi";

const initialState = {
  orders: [],
  orderData: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {

    clearError: (state) => {
      state.error = null;
    },

    clearOrder: (state) => {
      state.orderData = null;
    }

  },

  extraReducers: (builder) => {
    builder

      // ✅ CREATE ORDER
      .addCase(Orderinsert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(Orderinsert.fulfilled, (state, action) => {
        state.loading = false;

        // backend se jo response ayega
        state.orderData = action.payload;

        state.error = null;
      })

      .addCase(Orderinsert.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Order creation failed";
      });
  },
});

export const { clearError, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;