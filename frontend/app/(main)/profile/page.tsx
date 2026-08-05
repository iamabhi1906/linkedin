'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, CircularProgress, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchMeThunk } from '@/features/user/user.action';
import ProfileHeaderCard from '@/components/profile/profile-header-card';
import ProfileAboutCard from '@/components/profile/profile-about-card';
import ProfileSidebar from '@/components/profile/profile-sidebar';
import EditProfileModal from '@/components/profile/edit-profile-modal';

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.user);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ProfileHeaderCard profile={profile} />
            <ProfileAboutCard about={profile?.about} onEdit={() => setOpenEditModal(true)} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileSidebar />
          </Grid>
        </Grid>
      </Container>

      <EditProfileModal open={openEditModal} onClose={() => setOpenEditModal(false)} currentUser={profile} />
    </>
  );
}
