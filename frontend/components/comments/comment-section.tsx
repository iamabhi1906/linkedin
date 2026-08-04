'use client';

import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch } from '@/app/store';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import {
  fetchCommentsThunk,
  addCommentThunk,
} from '@/features/comment/comment.action';
import {
  selectCommentsForPost,
  selectCommentsLoading,
} from '@/features/comment/comment.slice';
import { CommentInput } from './comment-input';
import { CommentItem } from './comment-item';
import { CommentSkeleton } from './comment-skeleton';
import { useSnackbar } from 'notistack';
import styles from './comment-section.module.css';

interface CommentSectionProps {
  postId: string;
  postAuthorId?: string;
  onCommentAdded?: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  postAuthorId,
  onCommentAdded,
}) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const comments = useSelector((state: RootState) => selectCommentsForPost(state, postId));
  const loading = useSelector((state: RootState) => selectCommentsLoading(state, postId));

  const { profile } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = profile || user;

  useEffect(() => {
    dispatch(fetchCommentsThunk(postId));
  }, [dispatch, postId]);

  const handleAddRootComment = async (content: string, mediaUrl?: string) => {
    try {
      await dispatch(addCommentThunk({ postId, content, mediaUrl })).unwrap();
      enqueueSnackbar('Comment posted!', { variant: 'success' });
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch {
      enqueueSnackbar('Failed to post comment', { variant: 'error' });
    }
  };

  return (
    <Box className={styles.commentSection}>
      <CommentInput
        userAvatar={currentUser?.profilePicture || undefined}
        userName={currentUser?.name || 'U'}
        placeholder="Add a comment..."
        onSubmit={handleAddRootComment}
        buttonText="Comment"
      />

      {loading && comments.length === 0 ? (
        <CommentSkeleton />
      ) : (
        <Box className={styles.commentsList}>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                postAuthorId={postAuthorId}
              />
            ))
          ) : (
            <Typography className={styles.emptyStateText}>
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;
