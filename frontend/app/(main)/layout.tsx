'use client';

import React, { useEffect } from 'react';
import Header from '@/components/layout/header';
import { Box, Container } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchMeThunk } from '@/features/user/user.action';
import SignInPage from '../(auth)/signin/page';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchMeThunk());
    }
  }, [dispatch, profile]);

  if (!profile) {
    return <SignInPage />;
  }

  return (
    <Box sx={{ minHeight: '100dvh', backgroundColor: '#F3F2EF' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
