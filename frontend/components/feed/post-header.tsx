'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import {
  Add as AddIcon,
  Check as CheckIcon,
  HourglassEmpty as HourglassIcon,
  MoreHoriz as MoreIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { followService } from '@/services/follows/follow.service';
import { useSnackbar } from 'notistack';
import { Post } from '@/features/post/post.type';
import styles from './post-card.module.css';

interface PostHeaderProps {
  post: Post;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [isFollowing, setIsFollowing] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const targetPost = post.originalPost || post;
  const isOtherUser = Boolean(
    targetPost.author && targetPost.author.id && targetPost.author.id !== currentUser?.id,
  );

  useEffect(() => {
    if (isOtherUser && targetPost.author?.id) {
      followService
        .getFollowStatus(targetPost.author.id)
        .then((res) => {
          setIsFollowing(res.isFollowing);
          setHasPendingRequest(res.hasPendingRequestFromMe);
        })
        .catch(() => null);
    }
  }, [isOtherUser, targetPost.author?.id]);

  const handleFollowClick = async () => {
    if (!targetPost.author?.id || loadingFollow) return;
    setLoadingFollow(true);
    try {
      const res = await followService.sendFollowRequest(targetPost.author.id);
      if (res.follow?.status === 'ACCEPTED') {
        setIsFollowing(true);
        setHasPendingRequest(false);
      } else {
        setHasPendingRequest(true);
      }
      enqueueSnackbar(res.message || 'Follow request sent', { variant: 'success' });
    } catch (err: unknown) {
      enqueueSnackbar(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          'Failed to send follow request',
        { variant: 'error' },
      );
    } finally {
      setLoadingFollow(false);
    }
  };

  const authorName: string =
    targetPost.organization?.name || targetPost.author?.name || 'User';
  const authorAvatar =
    (typeof targetPost.organization?.logo === 'string'
      ? targetPost.organization.logo
      : undefined) ||
    (typeof targetPost.author?.profilePicture === 'string'
      ? targetPost.author.profilePicture
      : undefined);

  return (
    <Box className={styles.headerRow}>
      <Box className={styles.authorBox}>
        <Avatar src={authorAvatar}>{authorName[0]}</Avatar>
        <Box className={styles.authorInfo}>
          <Typography variant="subtitle2" className={styles.authorName}>
            {authorName}
          </Typography>
          <Typography variant="caption" className={styles.authorHeadline}>
            {targetPost.author?.headline || 'LinkedIn Member'}
          </Typography>
        </Box>
      </Box>
      <Box className={styles.headerActions}>
        {isOtherUser && !isFollowing && !hasPendingRequest && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleFollowClick}
            disabled={loadingFollow}
            className={styles.followBtn}
          >
            Follow
          </Button>
        )}

        {isOtherUser && hasPendingRequest && (
          <Button
            variant="text"
            size="small"
            startIcon={<HourglassIcon />}
            disabled
            className={styles.pendingBtn}
          >
            Pending
          </Button>
        )}

        {isOtherUser && isFollowing && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<CheckIcon />}
            disabled
            className={styles.followingBtn}
          >
            Following
          </Button>
        )}

        <IconButton size="small">
          <MoreIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
