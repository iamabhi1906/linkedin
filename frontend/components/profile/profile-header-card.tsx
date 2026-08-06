'use client';

import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VerifiedIcon from '@mui/icons-material/Verified';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { userService } from '@/services/users/user.service';
import { followService } from '@/services/follows/follow.service';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { fetchMeThunk } from '@/features/user/user.action';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import EditProfileModal from './edit-profile-modal';
import styles from './profile-header-card.module.css';
import { User } from '@/features/user/user.type';

interface ProfileHeaderCardProps {
  profile: User | null;
  isOwnProfile?: boolean;
}

export default function ProfileHeaderCard({ profile, isOwnProfile = true }: ProfileHeaderCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Follow states for viewing another profile
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    if (!isOwnProfile && profile?.id) {
      followService
        .getFollowStatus(profile.id)
        .then((res) => {
          setIsFollowing(res.isFollowing);
          setHasPendingRequest(res.hasPendingRequestFromMe);
        })
        .catch(() => null);
    }
  }, [isOwnProfile, profile?.id]);

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

  const handleFollowAction = async () => {
    if (!profile?.id || loadingFollow) return;
    setLoadingFollow(true);
    try {
      if (isFollowing) {
        await followService.unfollow(profile.id);
        setIsFollowing(false);
        setHasPendingRequest(false);
        enqueueSnackbar(`Unfollowed ${profile.name}`, { variant: 'info' });
      } else if (hasPendingRequest) {
        enqueueSnackbar('Follow request is pending', { variant: 'info' });
      } else {
        const res = await followService.sendFollowRequest(profile.id);
        if (res.follow?.status === 'ACCEPTED') {
          setIsFollowing(true);
          setHasPendingRequest(false);
          enqueueSnackbar(`You are now following ${profile.name}`, { variant: 'success' });
        } else {
          setHasPendingRequest(true);
          enqueueSnackbar('Follow request sent', { variant: 'success' });
        }
      }
    } catch (err: unknown) {
      enqueueSnackbar(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          'Action failed',
        { variant: 'error' },
      );
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleMessageUser = () => {
    router.push(`/messaging?userId=${profile?.id}`);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    enqueueSnackbar('Profile link copied to clipboard!', { variant: 'success' });
    setAnchorEl(null);
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
          {isOwnProfile && (
            <IconButton component="label" className={styles.editCoverBtn}>
              <input type="file" hidden accept="image/*" onChange={handleCoverUpload} />
              <CameraAltIcon fontSize="small" />
            </IconButton>
          )}
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
            {isOwnProfile && (
              <IconButton component="label" className={styles.cameraBtn}>
                <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                <CameraAltIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {isOwnProfile && (
            <IconButton className={styles.editIntroBtn} onClick={() => setOpenEditModal(true)}>
              <EditIcon />
            </IconButton>
          )}

          <Box className={styles.nameRow}>
            <Typography className={styles.userName}>{name}</Typography>
            {profile?.isVerified !== false && <VerifiedIcon className={styles.verifiedBadge} />}
          </Box>

          <Box className={styles.infoGrid}>
            <Box className={styles.leftInfo}>
              <Typography className={styles.headline}>{headline || 'LinkedIn Member'}</Typography>

              <Typography className={styles.locationRow}>
                {location || 'Location not specified'} - <span className={styles.contactInfoLink}>Contact info</span>
              </Typography>

              <Box>
                <Typography className={styles.connectionsText}>500+ connections</Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.btnActionsRow}>
            {isOwnProfile ? (
              <>
                <Button variant="contained" className={styles.openToBtn}>
                  Open to
                </Button>
                <Button variant="outlined" className={styles.outlinedActionBtn}>
                  Add profile section
                </Button>
                <Button variant="outlined" className={styles.outlinedActionBtn}>
                  Enhance profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={isFollowing ? 'outlined' : 'contained'}
                  className={
                    isFollowing
                      ? styles.followingBtn
                      : hasPendingRequest
                      ? styles.pendingBtn
                      : styles.followBtn
                  }
                  disabled={loadingFollow}
                  onClick={handleFollowAction}
                  startIcon={
                    isFollowing ? (
                      <CheckIcon />
                    ) : hasPendingRequest ? (
                      <HourglassEmptyIcon />
                    ) : (
                      <AddIcon />
                    )
                  }
                >
                  {isFollowing ? 'Following' : hasPendingRequest ? 'Pending' : 'Follow'}
                </Button>

                <Button
                  variant="outlined"
                  className={styles.messageBtn}
                  onClick={handleMessageUser}
                  startIcon={<SendIcon />}
                >
                  Message
                </Button>
              </>
            )}

            <IconButton className={styles.moreBtn} onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreHorizIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleCopyLink}>
                <ListItemIcon>
                  <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy link to profile</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          <Box className={styles.openToWorkBox}>
            <Box>
              <Typography className={styles.openToWorkTitle}>Open to work</Typography>
              <Typography className={styles.openToWorkSubtext}>
                {headline || 'Software Engineer | Open to new opportunities'}
              </Typography>
              <Typography className={styles.showDetailsLink}>Show details</Typography>
            </Box>
            {isOwnProfile && (
              <IconButton size="small" onClick={() => setOpenEditModal(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Card>

      {isOwnProfile && (
        <EditProfileModal open={openEditModal} onClose={() => setOpenEditModal(false)} currentUser={profile} />
      )}
    </>
  );
}
