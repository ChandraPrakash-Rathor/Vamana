import { createSlice } from '@reduxjs/toolkit';
import {
  getAllThemes,
  getActiveTheme,
  activateTheme,
  createTheme,
  updateTheme,
  deleteTheme
} from '../apis/ThemeApi';

const initialState = {
  themes: [],
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
      // Get all themes
      .addCase(getAllThemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllThemes.fulfilled, (state, action) => {
        state.loading = false;
        state.themes = action.payload.data || [];
      })
      .addCase(getAllThemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch themes';
      })

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
      })

      // Activate theme
      .addCase(activateTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTheme = action.payload.data;
        // Update themes list
        state.themes = state.themes.map(theme =>
          theme._id === action.payload.data._id
            ? { ...theme, isActive: true }
            : { ...theme, isActive: false }
        );
      })
      .addCase(activateTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to activate theme';
      })

      // Create theme
      .addCase(createTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.themes.push(action.payload.data);
      })
      .addCase(createTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create theme';
      })

      // Update theme
      .addCase(updateTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.themes.findIndex(t => t._id === action.payload.data._id);
        if (index !== -1) {
          state.themes[index] = action.payload.data;
        }
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update theme';
      })

      // Delete theme
      .addCase(deleteTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.themes = state.themes.filter(t => t._id !== action.meta.arg);
      })
      .addCase(deleteTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete theme';
      });
  }
});

export const { clearThemeError } = themeSlice.actions;
export default themeSlice.reducer;
