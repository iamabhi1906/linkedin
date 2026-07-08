import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Signin, Signup, User } from './auth.types';

interface AuthState {
  user: User | null;
  users: User[];
  loading: boolean;
  error: {
    path: string;
    reason: string;
  } | null;
}

const initialState: AuthState = {
  user: null,
  users: [],
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Signin>) => {
      const user = state.users.find((user) => user.email === action.payload.email);
      if (!user) {
        state.error = { path: 'email', reason: 'User not found' };
        return;
      }
      if (user.password !== action.payload.password) {
        state.error = { path: 'password', reason: 'Incorrect password' };
        return;
      }
      state.user = user;
      state.error = null;
    },

    signup: (state, action: PayloadAction<Signup>) => {
      const user = state.users.find((user) => user.email === action.payload.email);
      if (user) {
        state.error = { path: 'email', reason: 'User already exist' };
        return;
      }
      state.users.push(action.payload);
      state.user = action.payload;
      state.error = null;
    },

    getCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
});

export const { login, signup, getCurrentUser, logout } = authSlice.actions;

export default authSlice.reducer;
