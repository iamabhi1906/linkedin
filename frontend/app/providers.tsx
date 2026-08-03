'use client';

import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SnackbarProvider } from 'notistack';
import store, { persistor } from './store';
import ThemeProviderComp from './theme';
import { PersistGate } from 'redux-persist/integration/react';
import AuthInitializer from '@/components/auth-initializer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRouterCacheProvider>
            <ThemeProviderComp>
              <SnackbarProvider
                autoHideDuration={4000}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom',
                }}
              >
                <AuthInitializer>{children}</AuthInitializer>
              </SnackbarProvider>
            </ThemeProviderComp>
          </AppRouterCacheProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
