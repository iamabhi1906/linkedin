'use client';

import React, { useRef, useState } from 'react';
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material';
import { Image as ImageIcon, Close as CloseIcon, Gif as GifIcon } from '@mui/icons-material';
import { postService } from '@/services/posts/post.service';
import { useSnackbar } from 'notistack';
import styles from './comment-input.module.css';

interface CommentInputProps {
  userAvatar?: string;
  userName?: string;
  placeholder?: string;
  onSubmit: (content: string, mediaUrl?: string) => Promise<void>;
  buttonText?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  userAvatar,
  userName = 'U',
  placeholder = 'Add a comment...',
  onSubmit,
  buttonText = 'Comment',
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await postService.uploadMedia(file);
      setMediaUrl(res.url);
    } catch {
      enqueueSnackbar('Failed to upload image', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setSubmitting(true);
    try {
      await onSubmit(content.trim(), mediaUrl);
      setContent('');
      setMediaUrl(undefined);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={styles.inputWrapper}>
      <Avatar src={userAvatar} className={styles.avatar}>
        {userName[0] || 'U'}
      </Avatar>

      <Box component="form" className={styles.inputCard} onSubmit={handleSubmit}>
        <TextField
          multiline
          maxRows={4}
          size="small"
          className={styles.textField}
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {mediaUrl && (
          <Box className={styles.mediaPreviewContainer}>
            <img src={mediaUrl} alt="attachment preview" className={styles.mediaPreview} />
            <IconButton size="small" className={styles.removeMediaBtn} onClick={() => setMediaUrl(undefined)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box className={styles.inputActionRow}>
          <Box className={styles.iconButtonsGroup}>
            <input type="file" accept="image/*" ref={fileInputRef} className={styles.hiddenFileInput} onChange={handleFileChange} />
            <IconButton size="small" className={styles.iconBtn} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <ImageIcon />
            </IconButton>
            <IconButton size="small" className={styles.iconBtn} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <GifIcon />
            </IconButton>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="small"
            className={styles.submitBtn}
            disabled={(!content.trim() && !mediaUrl) || submitting || uploading}
          >
            {submitting ? '...' : buttonText}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
