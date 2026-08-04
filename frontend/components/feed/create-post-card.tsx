'use client';

import React, { useRef, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Dialog, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PollIcon from '@mui/icons-material/Poll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { postService } from '@/services/posts/post.service';
import { useSnackbar } from 'notistack';
import { createPostThunk, fetchFeedThunk } from '@/features/post/post.action';
import styles from './create-post-card.module.css';

export default function CreatePostCard() {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { profile } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = profile || user;

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [audience, setAudience] = useState<'PUBLIC' | 'CONNECTIONS'>('PUBLIC');
  const [audienceAnchor, setAudienceAnchor] = useState<null | HTMLElement>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setContent('');
    setMediaFiles([]);
    setPreviews([]);
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      const newFiles = [...mediaFiles, ...selected];
      setMediaFiles(newFiles);

      const newPreviews = selected.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image',
      }));
      setPreviews((prev) => [...prev, ...newPreviews]);

      if (!open) {
        setOpen(true);
      }
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;
    setSubmitting(true);
    try {
      const newPost = await dispatch(createPostThunk({ content, visibility: audience })).unwrap();

      if (mediaFiles.length > 0 && newPost?.id) {
        for (const file of mediaFiles) {
          await postService.attachMedia(newPost.id, file);
        }
      }

      await dispatch(fetchFeedThunk({ page: 1, limit: 20 }));
      enqueueSnackbar('Post published successfully!', { variant: 'success' });
      handleClose();
    } catch (err: unknown) {
      enqueueSnackbar((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to publish post', {
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <input type="file" ref={fileInputRef} hidden multiple accept="image/*,video/*" onChange={handleMediaSelect} />

      <Card elevation={0} className={styles.card}>
        <CardContent sx={{ p: 2, pb: '16px !important' }}>
          <Box className={styles.topRow}>
            <Avatar src={currentUser?.profilePicture || undefined} sx={{ width: 48, height: 48, backgroundColor: '#0a66c2', fontWeight: 600 }}>
              {currentUser?.name?.[0] || 'U'}
            </Avatar>
            <Button onClick={handleOpen} className={styles.startPostBtn}>
              Start a post, try writing with AI
            </Button>
          </Box>

          <Box className={styles.actionRow}>
            <Button
              onClick={() => fileInputRef.current?.click()}
              startIcon={<ImageIcon sx={{ color: '#378FE9', fontSize: 24 }} />}
              className={styles.actionBtn}
            >
              Media
            </Button>
            <Button onClick={handleOpen} startIcon={<CalendarMonthIcon sx={{ color: '#C76F16', fontSize: 24 }} />} className={styles.actionBtn}>
              Event
            </Button>
            <Button onClick={handleOpen} startIcon={<ArticleIcon sx={{ color: '#E06847', fontSize: 24 }} />} className={styles.actionBtn}>
              Write article
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" slotProps={{ paper: { className: styles.dialogPaper } }}>
        <Box className={styles.dialogHeader}>
          <Box className={styles.userHeaderBox}>
            <Avatar
              src={currentUser?.profilePicture || undefined}
              sx={{ width: 52, height: 52, backgroundColor: '#0a66c2', fontWeight: 600, fontSize: '1.25rem' }}
            >
              {currentUser?.name?.[0] || 'U'}
            </Avatar>
            <Box className={styles.userInfo}>
              <Typography className={styles.userName}>{currentUser?.name || 'Abhishek Kumar'}</Typography>
              <Button size="small" className={styles.audiencePill} onClick={(e) => setAudienceAnchor(e.currentTarget)}>
                {audience === 'PUBLIC' ? <PublicIcon sx={{ fontSize: 14 }} /> : <PeopleIcon sx={{ fontSize: 14 }} />}
                {audience} <ArrowDropDownIcon sx={{ fontSize: 16 }} />
              </Button>
            </Box>
          </Box>

          <IconButton onClick={handleClose} className={styles.closeIconBtn}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Menu anchorEl={audienceAnchor} open={Boolean(audienceAnchor)} onClose={() => setAudienceAnchor(null)}>
          <MenuItem
            onClick={() => {
              setAudience('PUBLIC');
              setAudienceAnchor(null);
            }}
          >
            <PublicIcon sx={{ mr: 1, fontSize: 18, color: '#666666' }} /> Anyone
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAudience('CONNECTIONS');
              setAudienceAnchor(null);
            }}
          >
            <PeopleIcon sx={{ mr: 1, fontSize: 18, color: '#666666' }} /> Connections only
          </MenuItem>
        </Menu>

        <Box className={styles.contentBox}>
          <TextField
            multiline
            rows={5}
            fullWidth
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="standard"
            slotProps={{ input: { disableUnderline: true, className: styles.inputField } }}
          />

          {previews.length > 0 && (
            <Box className={styles.mediaPreviewContainer}>
              {previews.map((p, idx) => (
                <Box key={idx} className={styles.mediaPreviewItem}>
                  {p.type === 'video' ? (
                    <video src={p.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <IconButton size="small" onClick={() => handleRemoveMedia(idx)} className={styles.removeMediaBtn}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box className={styles.toolbarRow}>
          <Box className={styles.toolbarLeft}>
            <IconButton className={styles.iconToolBtn} title="Add Media" onClick={() => fileInputRef.current?.click()}>
              <PhotoSizeSelectActualIcon sx={{ fontSize: 22, color: mediaFiles.length > 0 ? '#0A66C2' : 'inherit' }} />
            </IconButton>

            <IconButton className={styles.iconToolBtn} title="Create a Poll">
              <PollIcon sx={{ fontSize: 22 }} />
            </IconButton>

            <IconButton className={styles.iconToolBtn} title="Celebrate an occasion">
              <WorkspacePremiumIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>
        </Box>

        <Box className={styles.dialogFooter}>
          <IconButton className={styles.iconToolBtn} title="Schedule post">
            <AccessTimeIcon sx={{ fontSize: 22 }} />
          </IconButton>

          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={(!content.trim() && mediaFiles.length === 0) || submitting}
            className={styles.postSubmitBtn}
          >
            {submitting ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
