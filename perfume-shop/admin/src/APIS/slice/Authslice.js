import { createSlice } from '@reduxjs/toolkit'
import { 
  loginUser, 
  getMe, 
  updateProfile, 
  changePassword, 
  getAllAdmins, 
  createNewAdmin, 
  deleteAdmin 
} from '../apis/Authapi'

const initialState = {
  companyLogo: '',
  loginData: '',
  currentUser: null,
  admins: [],
  loading: false,
  adminsLoading: false,
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    clearAuthData: (state) => {
      state.loginData = '';
      state.currentUser = null;
      state.admins = [];
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      // Handle both {token, admin} and {data:{token, admin}} shapes
      state.loginData = action.payload;
      state.loading = false;
    })
    builder.addCase(loginUser.rejected, (state) => {
      state.loading = false;
    })

    // Get Me
    builder.addCase(getMe.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(getMe.fulfilled, (state, action) => {
      // Handle both {admin:{}} and {data:{admin:{}}} shapes
      state.currentUser = action.payload?.data?.admin || action.payload?.admin || null;
      state.loading = false;
    })
    builder.addCase(getMe.rejected, (state) => {
      state.loading = false;
    })

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.currentUser = action.payload?.data?.admin || action.payload?.admin || null;
      state.loading = false;
    })
    builder.addCase(updateProfile.rejected, (state) => {
      state.loading = false;
    })

    // Change Password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(changePassword.rejected, (state) => {
      state.loading = false;
    })

    // Get All Admins
    builder.addCase(getAllAdmins.pending, (state) => {
      state.adminsLoading = true;
    })
    builder.addCase(getAllAdmins.fulfilled, (state, action) => {
      // API returns {success, message, data:{admins:[], count:N}}
      state.admins = action.payload?.data?.admins || action.payload?.admins || [];
      state.adminsLoading = false;
    })
    builder.addCase(getAllAdmins.rejected, (state) => {
      state.admins = [];
      state.adminsLoading = false;
    })

    // Create New Admin
    builder.addCase(createNewAdmin.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(createNewAdmin.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(createNewAdmin.rejected, (state) => {
      state.loading = false;
    })

    // Delete Admin
    builder.addCase(deleteAdmin.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(deleteAdmin.fulfilled, (state) => {
      state.loading = false;
    })
    builder.addCase(deleteAdmin.rejected, (state) => {
      state.loading = false;
    })
  },
})

export const { clearAuthData } = loginSlice.actions

export default loginSlice.reducer