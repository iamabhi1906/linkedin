'use client';

import React, { useState } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { Comment } from '@/features/comment/comment.type';
import { CommentActions } from './comment-actions';
import { CommentInput } from './comment-input';
import { useAppDispatch } from '@/app/store';
import { toggleCommentLikeThunk, addCommentThunk } from '@/features/comment/comment.action';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useSnackbar } from 'notistack';
import styles from './comment-item.module.css';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  postAuthorId?: string;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, postAuthorId }) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { profile } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = profile || user;

  const [showReplyForm, setShowReplyForm] = useState(false);

  const isPostAuthor = postAuthorId ? comment.authorId === postAuthorId : false;
  const authorName = comment.author?.name || 'LinkedIn User';
  const authorAvatar = comment.author?.profilePicture || undefined;

  const handleToggleLike = async (reactionOverride?: string) => {
    try {
      await dispatch(
        toggleCommentLikeThunk({
          postId,
          commentId: comment.id,
          reaction: reactionOverride || comment.selectedReaction || 'like',
        }),
      ).unwrap();
    } catch {
      enqueueSnackbar('Failed to like comment', { variant: 'error' });
    }
  };

  const handleAddReply = async (content: string, mediaUrl?: string) => {
    try {
      await dispatch(
        addCommentThunk({
          postId,
          content,
          parentId: comment.id,
          mediaUrl,
        }),
      ).unwrap();
      setShowReplyForm(false);
      enqueueSnackbar('Reply posted!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to post reply', { variant: 'error' });
    }
  };

  return (
    <Box className={styles.commentItemContainer}>
      <Avatar src={authorAvatar} className={styles.avatar}>
        {authorName[0] || 'U'}
      </Avatar>

      <Box className={styles.contentWrapper}>
        <Box className={styles.commentBubble}>
          <Box className={styles.headerRow}>
            <Box className={styles.authorInfoLeft}>
              <Typography component="span" className={styles.authorName}>
                {authorName}
              </Typography>
              {isPostAuthor && <span className={styles.authorBadge}>Author</span>}
            </Box>
            <Typography component="span" className={styles.timeText}>
              {comment.createdAt ? 'Recently' : ''}
            </Typography>
          </Box>

          {comment.author?.headline && <Typography className={styles.headlineText}>{comment.author.headline}</Typography>}

          {comment.content && <Typography className={styles.contentText}>{comment.content}</Typography>}

          {comment.mediaUrl && <img src={comment.mediaUrl} alt="comment attachment" className={styles.commentMedia} />}
        </Box>

        <CommentActions
          liked={!!comment.liked}
          likesCount={comment.likesCount || 0}
          selectedReaction={comment.selectedReaction}
          onToggleLike={handleToggleLike}
          onToggleReply={() => setShowReplyForm((prev) => !prev)}
        />

        {showReplyForm && (
          <Box className={styles.replyInputWrapper}>
            <CommentInput
              userAvatar={currentUser?.profilePicture || undefined}
              userName={currentUser?.name || 'U'}
              placeholder={`Reply to ${authorName}...`}
              onSubmit={handleAddReply}
              buttonText="Reply"
            />
          </Box>
        )}

        {comment.children && comment.children.length > 0 && (
          <Box className={styles.nestedContainer}>
            {comment.children.map((child) => (
              <CommentItem key={child.id} comment={child} postId={postId} postAuthorId={postAuthorId} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommentItem;
