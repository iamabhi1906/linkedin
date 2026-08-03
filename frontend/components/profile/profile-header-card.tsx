'use client';

import React, { useState } from 'react';
import { Avatar, Box, Button, Card, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VerifiedIcon from '@mui/icons-material/Verified';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { userService } from '@/services/users/user.service';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { fetchMeThunk } from '@/features/user/user.action';
import { useSnackbar } from 'notistack';
import EditProfileModal from './edit-profile-modal';
import styles from './profile-header-card.module.css';
import { User } from '@/features/user/user.type';

interface ProfileHeaderCardProps {
  profile: User | null;
}

export default function ProfileHeaderCard({ profile }: ProfileHeaderCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await userService.uploadCoverPicture(e.target.files[0]);
        dispatch(fetchMeThunk());
        enqueueSnackbar('Cover picture updated!', { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to update cover picture', { variant: 'error' });
      }
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await userService.uploadProfilePicture(e.target.files[0]);
        dispatch(fetchMeThunk());
        enqueueSnackbar('Profile picture updated!', { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to update profile picture', { variant: 'error' });
      }
    }
  };

  const name = profile?.name;
  const headline = profile?.headline;
  const location = profile?.location;

  return (
    <>
      <Card elevation={0} className={styles.card}>
        <Box
          className={styles.coverBanner}
          style={
            profile?.coverPicture
              ? {
                  backgroundImage: `url(${profile.coverPicture})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          <IconButton component="label" className={styles.editCoverBtn}>
            <input type="file" hidden accept="image/*" onChange={handleCoverUpload} />
            <CameraAltIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box className={styles.cardBody}>
          <Box className={styles.avatarWrapper}>
            <Avatar
              src={profile?.profilePicture || undefined}
              className={styles.avatar}
              sx={{
                width: 152,
                height: 152,
                border: '4px solid #ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                backgroundColor: '#0a66c2',
                fontSize: '3.5rem',
                fontWeight: 600,
              }}
            >
              {name?.[0] || 'U'}
            </Avatar>
            <IconButton component="label" className={styles.cameraBtn}>
              <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
              <CameraAltIcon fontSize="small" />
            </IconButton>
          </Box>

          <IconButton className={styles.editIntroBtn} onClick={() => setOpenEditModal(true)}>
            <EditIcon />
          </IconButton>

          <Box className={styles.nameRow}>
            <Typography className={styles.userName}>{name}</Typography>
            {profile?.isVerified !== false && <VerifiedIcon className={styles.verifiedBadge} />}
            <Typography className={styles.pronouns}>(He/Him)</Typography>
          </Box>

          <Box className={styles.infoGrid}>
            <Box className={styles.leftInfo}>
              <Typography className={styles.headline}>{headline}</Typography>

              <Typography className={styles.locationRow}>
                {location} - <span className={styles.contactInfoLink}>Contact info</span>
              </Typography>

              <Box>
                <Typography className={styles.connectionsText}>296 connections</Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.btnActionsRow}>
            <Button variant="contained" className={styles.openToBtn}>
              Open to
            </Button>
            <Button variant="outlined" className={styles.outlinedActionBtn}>
              Add profile section
            </Button>
            <Button variant="outlined" className={styles.outlinedActionBtn}>
              Enhance profile
            </Button>
            <IconButton className={styles.moreBtn}>
              <MoreHorizIcon />
            </IconButton>
          </Box>

          <Box className={styles.openToWorkBox}>
            <Box>
              <Typography className={styles.openToWorkTitle}>Open to work • Recruiters only</Typography>
              <Typography className={styles.openToWorkSubtext}>Full Stack Developer, Software Engineer | On-site • Hybrid • Remote</Typography>
              <Typography className={styles.showDetailsLink}>Show details</Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpenEditModal(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Card>

      <EditProfileModal open={openEditModal} onClose={() => setOpenEditModal(false)} currentUser={profile} />
    </>
  );
}
