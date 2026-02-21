import { createSlice } from '@reduxjs/toolkit'
import { insertProduct, GetProduct, DeleteProduct, UpdateProduct } from '../apis/ProductApi'

const initialState = {
    companyLogo: '',
    loading: false,
    productData: [],
}

export const ProductSlice = createSlice({
  name: 'ProductSlice',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // insertProduct cases
    builder.addCase(insertProduct.pending, (state, action) => {
        state.loading = true;
      })
      builder.addCase(insertProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      builder.addCase(insertProduct.rejected, (state, action) => {
        state.loading = false;
      })

    // GetProduct cases
    builder.addCase(GetProduct.pending, (state, action) => {
        state.loading = true;
      })
      builder.addCase(GetProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productData = action.payload?.data;
      })
      builder.addCase(GetProduct.rejected, (state, action) => {
        state.loading = false;
      })

    // DeleteProduct cases
    builder.addCase(DeleteProduct.pending, (state, action) => {
        state.loading = true;
      })
      builder.addCase(DeleteProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      builder.addCase(DeleteProduct.rejected, (state, action) => {
        state.loading = false;
      })

    // UpdateProduct cases
    builder.addCase(UpdateProduct.pending, (state, action) => {
        state.loading = true;
      })
      builder.addCase(UpdateProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      builder.addCase(UpdateProduct.rejected, (state, action) => {
        state.loading = false;
      })
  },
})

export default ProductSlice.reducer
