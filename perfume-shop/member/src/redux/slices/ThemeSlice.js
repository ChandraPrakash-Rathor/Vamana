import { createSlice } from '@reduxjs/toolkit';
import { getActiveTheme } from '../apis/ThemeApi';

const initialState = {
  activeTheme: null,
  loading: false,
  error: null
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    clearThemeError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get active theme
      .addCase(getActiveTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTheme = action.payload.data;
      })
      .addCase(getActiveTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch active theme';
      });
  }
});

export const { clearThemeError } = themeSlice.actions;
export default themeSlice.reducer;
