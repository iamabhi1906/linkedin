'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch } from '@/app/store';
import { repostThunk } from '@/features/post/post.action';
import { useSnackbar } from 'notistack';
import { Post } from '@/features/post/post.type';
import styles from './post-card.module.css';

interface RepostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post;
  onRepostSuccess: () => void;
}

export const RepostModal: React.FC<RepostModalProps> = ({
  open,
  onClose,
  post,
  onRepostSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [repostThoughts, setRepostThoughts] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const targetPost = post.originalPost || post;
  const authorName: string =
    targetPost.organization?.name || targetPost.author?.name || 'User';
  const authorAvatar =
    (typeof targetPost.organization?.logo === 'string'
      ? targetPost.organization.logo
      : undefined) ||
    (typeof targetPost.author?.profilePicture === 'string'
      ? targetPost.author.profilePicture
      : undefined);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await dispatch(
        repostThunk({ postId: post.id, content: repostThoughts }),
      ).unwrap();
      onRepostSuccess();
      enqueueSnackbar(res.message || 'Reposted with thoughts!', { variant: 'success' });
      setRepostThoughts('');
      onClose();
    } catch (err: unknown) {
      enqueueSnackbar((err as { message?: string }).message || 'Failed to repost', {
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>Repost with your thoughts</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What do you want to talk about?"
          value={repostThoughts}
          onChange={(e) => setRepostThoughts(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box className={styles.repostedCard}>
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
          <Typography variant="body2" sx={{ mt: 1, color: '#1D2226' }}>
            {targetPost.content}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            borderRadius: 4,
            backgroundColor: '#0A66C2',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};
