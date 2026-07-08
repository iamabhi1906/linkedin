'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useRouter } from 'next/navigation';
import { Container, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function Page() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user]);

  if (!user) return;

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', py: 12 }}>
      <Stack sx={{ alignItems: 'center' }} spacing={2}>
        <Typography variant="h2">Welcome {user.name}</Typography>
        <Typography variant="h6">Your are login using {user.email} </Typography>
      </Stack>
    </Container>
  );
}
