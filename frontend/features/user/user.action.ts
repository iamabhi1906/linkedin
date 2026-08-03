import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService, UpdateProfilePayload } from '@/services/users/user.service';

export const fetchMeThunk = createAsyncThunk('user/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const data = await userService.getMe();
    return data;
  } catch (err: unknown) {
    return rejectWithValue(err as string);
  }
});

export const updateProfileThunk = createAsyncThunk('user/updateProfile', async (payload: UpdateProfilePayload, { rejectWithValue }) => {
  try {
    const data = await userService.updateProfile(payload);
    return data;
  } catch (err: unknown) {
    return rejectWithValue(err as string);
  }
});
