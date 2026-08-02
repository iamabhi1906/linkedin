import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService, LoginPayload, SignupPayload } from '@/services/auth/auth.service';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const data = await authService.login(payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed',
      );
    }
  },
);

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      const data = await authService.signup(payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Signup failed',
      );
    }
  },
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});
