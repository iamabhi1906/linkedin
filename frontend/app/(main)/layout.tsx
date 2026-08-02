'use client';

import React from 'react';
import Header from '@/components/layout/header';
import { Box, Container } from '@mui/material';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F3F2EF' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
