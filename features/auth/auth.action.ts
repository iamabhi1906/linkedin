import { getCurrentUserService, removeCurrentUserService, signinService, signupService } from '@/services/auth.services';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Signup } from './auth.types';

export const signinUser = createAsyncThunk('auth/signin', async ({ email, password }: { email: string; password: string }, thunkAPI) => {
  try {
    return await signinService(email, password);
  } catch (err) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(err.message);
    }
    return thunkAPI.rejectWithValue('An unexpected authentication error occurred.');
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (data: Signup, thunkAPI) => {
  try {
    return await signupService(data);
  } catch (err) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(err.message);
    }
    return thunkAPI.rejectWithValue('An unexpected authentication error occurred.');
  }
});

export const loadCurrentUser = createAsyncThunk('auth/currUser', async (_, thunkAPI) => {
  try {
    return getCurrentUserService();
  } catch (err) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(err.message);
    }
    return thunkAPI.rejectWithValue('An unexpected authentication error occurred.');
  }
});

export const signoutUser = createAsyncThunk('auth/signout', async (_, thunkAPI) => {
  try {
    return removeCurrentUserService();
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue('An unexpected authentication error occurred.');
  }
});
