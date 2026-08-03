'use client';

import React, { useState } from 'react';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import styles from './comment-item.module.css';
import { Comment } from '@/features/comment/comment.type';
import { postService } from '@/services/posts/post.service';
import { useSnackbar } from 'notistack';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onCommentAdded?: () => void;
}

export default function CommentItem({ comment, postId, onCommentAdded }: CommentItemProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [children, setChildren] = useState<Comment[]>(comment.children || []);

  const handleToggleReply = () => {
    setShowReplyForm((prev) => !prev);
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const res = await postService.addComment(postId, replyText.trim(), comment.id);
      if (res.comment) {
        setChildren((prev) => [...prev, res.comment]);
      }
      setReplyText('');
      setShowReplyForm(false);
      enqueueSnackbar('Reply posted!', { variant: 'success' });
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch {
      enqueueSnackbar('Failed to post reply', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const authorName = comment.author?.name || 'LinkedIn User';
  const authorAvatar = comment.author?.profilePicture || undefined;

  return (
    <Box className={styles.commentContainer}>
      <Avatar src={authorAvatar} className={styles.avatar}>
        {authorName[0] || 'U'}
      </Avatar>

      <Box className={styles.commentBody}>
        <Box className={styles.commentBubble}>
          <Box className={styles.headerRow}>
            <Typography component="span" className={styles.authorName}>
              {authorName}
            </Typography>
          </Box>

          {comment.author?.headline && <Typography className={styles.headlineText}>{comment.author.headline}</Typography>}

          <Typography className={styles.contentText}>{comment.content}</Typography>
        </Box>

        <Box className={styles.actionRow}>
          <Button size="small" className={styles.actionButton} onClick={handleToggleReply}>
            Reply
          </Button>
        </Box>

        {showReplyForm && (
          <Box component="form" className={styles.replyForm} onSubmit={handleAddReply}>
            <TextField
              size="small"
              className={styles.replyInput}
              placeholder={`Reply to ${authorName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              autoFocus
            />
            <Button type="submit" variant="contained" size="small" className={styles.replySubmitBtn} disabled={!replyText.trim() || submitting}>
              {submitting ? '...' : 'Reply'}
            </Button>
          </Box>
        )}

        {children.length > 0 && (
          <Box className={styles.nestedContainer}>
            {children.map((child) => (
              <CommentItem key={child.id} comment={child} postId={postId} onCommentAdded={onCommentAdded} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
