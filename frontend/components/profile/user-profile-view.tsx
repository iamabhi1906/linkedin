'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CircularProgress, Container, Grid, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchMeThunk } from '@/features/user/user.action';
import { userService } from '@/services/users/user.service';
import { User } from '@/features/user/user.type';
import ProfileHeaderCard from './profile-header-card';
import ProfileAboutCard from './profile-about-card';
import ProfileSidebar from './profile-sidebar';
import EditProfileModal from './edit-profile-modal';
import Link from 'next/link';
import styles from './user-profile-view.module.css';

interface UserProfileViewProps {
  username: string;
}

export default function UserProfileView({ username }: UserProfileViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { profile: currentUser } = useSelector((state: RootState) => state.user);

  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!username) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    userService
      .getByUsername(username)
      .then((data) => {
        setTargetUser(data);
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        setError('User not found or unavailable');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <Box className={styles.loadingBox}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !targetUser) {
    return (
      <Container maxWidth="md">
        <Card elevation={0} className={styles.notFoundCard}>
          <Typography className={styles.notFoundTitle}>This profile is unavailable</Typography>
          <Typography className={styles.notFoundSubtext}>
            The user you are trying to view does not exist or may have changed their username.
          </Typography>
          <Button variant="contained" component={Link} href="/" className={styles.backHomeBtn}>
            Return to Feed
          </Button>
        </Card>
      </Container>
    );
  }

  const isOwnProfile = Boolean(currentUser && (currentUser.id === targetUser.id || currentUser.username === targetUser.username));

  const displayedUser = isOwnProfile ? currentUser || targetUser : targetUser;

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ProfileHeaderCard profile={displayedUser} isOwnProfile={isOwnProfile} />
            <ProfileAboutCard about={displayedUser?.about} isOwnProfile={isOwnProfile} onEdit={() => setOpenEditModal(true)} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileSidebar profile={displayedUser} isOwnProfile={isOwnProfile} />
          </Grid>
        </Grid>
      </Container>

      {isOwnProfile && <EditProfileModal open={openEditModal} onClose={() => setOpenEditModal(false)} currentUser={displayedUser} />}
    </>
  );
}
