'use client';

import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ibmPlex } from './ui/fonts';

export const theme = createTheme({
  cssVariables: true,

  typography: {
    fontFamily: ibmPlex.style.fontFamily,
  },

  palette: {
    mode: 'light',

    primary: {
      main: '#0A66C2',
      light: '#378FE9',
      dark: '#004182',
      contrastText: '#fff',
    },

    background: {
      default: '#F3F2EF',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#1D2226',
      secondary: '#666666',
    },

    divider: '#E0E0E0',

    success: {
      main: '#057642',
    },

    warning: {
      main: '#B24020',
    },

    error: {
      main: '#CC1016',
    },

    info: {
      main: '#0A66C2',
    },
  },

  shape: {
    borderRadius: 8,
  },
});

export default function ThemeProviderComp({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
