import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userService, UpdateProfilePayload } from '@/services/users/user.service';

export const fetchMeThunk = createAsyncThunk('user/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const data = await userService.getMe();
    return data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user profile');
  }
});

export const updateProfileThunk = createAsyncThunk(
  'user/updateProfile',
  async (payload: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const data = await userService.updateProfile(payload);
      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  },
);

interface UserState {
  profile: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchMeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default userSlice.reducer;
