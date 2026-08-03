'use client';

import React, { useState } from 'react';
import { Avatar, Box, Button, TextField } from '@mui/material';
import styles from './comment-section.module.css';
import { Comment } from '@/features/comment/comment.type';
import CommentItem from './comment-item';
import { postService } from '@/services/posts/post.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useSnackbar } from 'notistack';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded?: () => void;
}

export default function CommentSection({ postId, comments, onCommentAdded }: CommentSectionProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { profile } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = profile || user;

  const [commentList, setCommentList] = useState<Comment[]>(() => comments || []);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddRootComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await postService.addComment(postId, commentText.trim());
      if (res.comment) {
        setCommentList((prev) => [res.comment, ...prev]);
      }
      setCommentText('');
      enqueueSnackbar('Comment added!', { variant: 'success' });
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch {
      enqueueSnackbar('Failed to add comment', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const userAvatar = currentUser?.profilePicture || undefined;
  const userName = currentUser?.name || 'U';

  return (
    <Box className={styles.commentSection}>
      <Box className={styles.mainInputRow}>
        <Avatar src={userAvatar} className={styles.currentUserAvatar}>
          {userName[0] || 'U'}
        </Avatar>

        <Box component="form" className={styles.commentForm} onSubmit={handleAddRootComment}>
          <TextField
            size="small"
            className={styles.mainInput}
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit" variant="contained" className={styles.postButton} disabled={!commentText.trim() || submitting}>
            {submitting ? '...' : 'Post'}
          </Button>
        </Box>
      </Box>

      <Box className={styles.commentsList}>
        {commentList.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} onCommentAdded={onCommentAdded} />
        ))}
      </Box>
    </Box>
  );
}
