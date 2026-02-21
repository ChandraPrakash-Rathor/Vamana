
import { createSlice } from '@reduxjs/toolkit'
import { loginUser } from '../apis/Authapi'

const initialState = {
    companyLogo: '',
    loginData: '',
    loading:false,
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state, action) => {
        state.loading = true;

      })
      builder.addCase(loginUser.fulfilled , (state, action) => {
        state.loginData=action.payload;
        state.loading = false;
      })
      builder.addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
      
      })

  },

})

 

export default loginSlice.reducer