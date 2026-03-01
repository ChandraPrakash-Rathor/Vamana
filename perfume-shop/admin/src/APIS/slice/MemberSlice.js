import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as MemberApi from '../apis/MemberApi';

// Async thunks
export const fetchMembers = createAsyncThunk(
  'members/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MemberApi.getAllMembers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch members');
    }
  }
);

export const fetchMemberById = createAsyncThunk(
  'members/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await MemberApi.getMemberById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch member');
    }
  }
);

export const updateMemberStatus = createAsyncThunk(
  'members/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await MemberApi.updateMemberStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const deleteMember = createAsyncThunk(
  'members/delete',
  async (id, { rejectWithValue }) => {
    try {
      await MemberApi.deleteMember(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete member');
    }
  }
);

const memberSlice = createSlice({
  name: 'members',
  initialState: {
    members: [],
    selectedMember: null,
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearSelectedMember: (state) => {
      state.selectedMember = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all members
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch member by ID
    builder
      .addCase(fetchMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMember = action.payload;
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update member status
    builder
      .addCase(updateMemberStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMemberStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Member status updated successfully';
        // Update member in the list
        const index = state.members.findIndex(m => m._id === action.payload.data._id);
        if (index !== -1) {
          state.members[index] = action.payload.data;
        }
      })
      .addCase(updateMemberStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete member
    builder
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Member deleted successfully';
        state.members = state.members.filter(m => m._id !== action.payload);
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, clearSelectedMember } = memberSlice.actions;
export default memberSlice.reducer;
