'use client';

import { Provider } from 'react-redux';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SnackbarProvider } from 'notistack';

import store, { persistor } from './store';
import ThemeProviderComp from './theme';
import { PersistGate } from 'redux-persist/integration/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouterCacheProvider>
          <ThemeProviderComp>
            <SnackbarProvider
              autoHideDuration={5000}
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
              }}
            >
              {children}
            </SnackbarProvider>
          </ThemeProviderComp>
        </AppRouterCacheProvider>
      </PersistGate>
    </Provider>
  );
}
