'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, Box, Button, Card, Typography } from '@mui/material';
import {
  Add as AddIcon,
  Check as CheckIcon,
  HourglassEmpty as HourglassIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { followService } from '@/services/follows/follow.service';
import styles from './user-card.module.css';

export interface UserCardData {
  id: string;
  name: string;
  username: string;
  headline?: string | null;
  profilePicture?: string | null;
  coverPicture?: string | null;
  location?: string | null;
}

interface UserCardProps {
  user: UserCardData;
  onStatusChange?: () => void;
}

export default function UserCard({ user, onStatusChange }: UserCardProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [isFollowing, setIsFollowing] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.id) {
      followService
        .getFollowStatus(user.id)
        .then((res) => {
          setIsFollowing(res.isFollowing);
          setHasPendingRequest(res.hasPendingRequestFromMe);
        })
        .catch(() => null);
    }
  }, [user.id]);

  const handleFollowAction = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isFollowing) {
        await followService.unfollow(user.id);
        setIsFollowing(false);
        setHasPendingRequest(false);
        enqueueSnackbar(`Unfollowed ${user.name}`, { variant: 'info' });
      } else if (hasPendingRequest) {
        enqueueSnackbar('Follow request pending', { variant: 'info' });
      } else {
        const res = await followService.sendFollowRequest(user.id);
        if (res.follow?.status === 'ACCEPTED') {
          setIsFollowing(true);
          setHasPendingRequest(false);
          enqueueSnackbar(`You are now following ${user.name}`, { variant: 'success' });
        } else {
          setHasPendingRequest(true);
          enqueueSnackbar('Follow request sent', { variant: 'success' });
        }
      }
      onStatusChange?.();
    } catch (err: unknown) {
      enqueueSnackbar(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          'Action failed',
        { variant: 'error' },
      );
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = typeof user.profilePicture === 'string' ? user.profilePicture : undefined;
  const coverSrc = typeof user.coverPicture === 'string' ? user.coverPicture : undefined;

  return (
    <Card elevation={0} className={styles.userCard}>
      <Box
        className={styles.coverBanner}
        style={coverSrc ? { backgroundImage: `url(${coverSrc})` } : undefined}
      />
      <Box className={styles.cardContent}>
        <Avatar src={avatarSrc} className={styles.avatar}>
          {user.name?.[0] || 'U'}
        </Avatar>

        <Link href={`/profile`} className={styles.userName}>
          {user.name}
        </Link>

        <Typography variant="caption" className={styles.userHeadline}>
          {user.headline || 'LinkedIn Member'}
        </Typography>

        {user.location && (
          <Typography variant="caption" className={styles.userLocation}>
            {user.location}
          </Typography>
        )}

        <Button
          variant={isFollowing ? 'outlined' : 'contained'}
          color={isFollowing ? 'inherit' : 'primary'}
          size="small"
          disabled={loading || hasPendingRequest}
          onClick={handleFollowAction}
          startIcon={
            isFollowing ? (
              <CheckIcon />
            ) : hasPendingRequest ? (
              <HourglassIcon />
            ) : (
              <AddIcon />
            )
          }
          className={styles.actionButton}
        >
          {isFollowing ? 'Following' : hasPendingRequest ? 'Pending' : 'Follow'}
        </Button>
      </Box>
    </Card>
  );
}
