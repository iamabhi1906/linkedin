'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import {
  Image as ImageIcon,
  Event as EventIcon,
  Article as ArticleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { createPostThunk } from '@/features/post/post.slice';
import { useSnackbar } from 'notistack';
import { useSession } from 'next-auth/react';

export default function CreatePostCard() {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentUser = user || session?.user;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setContent('');
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await dispatch(createPostThunk({ content })).unwrap();
      enqueueSnackbar('Post published!', { variant: 'success' });
      handleClose();
    } catch (err: any) {
      enqueueSnackbar(err || 'Failed to publish post', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          border: '1px solid #E0E0E0',
          borderRadius: 2,
          backgroundColor: '#FFFFFF',
          mb: 2,
        }}
      >
        <CardContent sx={{ p: 2, pb: '16px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Avatar src={currentUser?.profilePicture || currentUser?.image}>
              {currentUser?.firstName?.[0] || currentUser?.name?.[0] || 'U'}
            </Avatar>
            <Button
              onClick={handleOpen}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                borderRadius: 5,
                borderColor: '#666666',
                color: '#666666',
                textTransform: 'none',
                py: 1.2,
                px: 2,
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '1px solid #B2B2B2',
                '&:hover': { backgroundColor: '#F3F2EF', borderColor: '#666666' },
              }}
            >
              Start a post
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              onClick={handleOpen}
              startIcon={<ImageIcon sx={{ color: '#378FE9' }} />}
              sx={{ color: '#666666', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Media
            </Button>
            <Button
              onClick={handleOpen}
              startIcon={<EventIcon sx={{ color: '#C76F16' }} />}
              sx={{ color: '#666666', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Event
            </Button>
            <Button
              onClick={handleOpen}
              startIcon={<ArticleIcon sx={{ color: '#E06847' }} />}
              sx={{ color: '#666666', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Write article
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create a post
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar src={currentUser?.profilePicture || currentUser?.image}>
              {currentUser?.firstName?.[0] || currentUser?.name?.[0] || 'U'}
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {currentUser?.firstName
                ? `${currentUser.firstName} ${currentUser.lastName || ''}`
                : currentUser?.name || 'User'}
            </Typography>
          </Box>
          <TextField
            multiline
            rows={5}
            fullWidth
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="standard"
            slotProps={{ input: { disableUnderline: true } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!content.trim() || submitting}
            sx={{ borderRadius: 5, textTransform: 'none', px: 3, fontWeight: 600 }}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
