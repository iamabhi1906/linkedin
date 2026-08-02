import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '@/features/auth/auth.slice';
import userReducer from '@/features/user/user.slice';
import postReducer from '@/features/post/post.slice';
import organizationReducer from '@/features/organization/organization.slice';
import jobReducer from '@/features/job/job.slice';

const persistedAuthReducer = persistReducer(
  {
    key: 'auth',
    storage,
    whitelist: ['user', 'accessToken', 'isAuthenticated'],
  },
  authReducer,
);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
    post: postReducer,
    organization: organizationReducer,
    job: jobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
