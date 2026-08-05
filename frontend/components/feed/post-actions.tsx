'use client';

import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { CommentOutlined as CommentIcon, Repeat as RepeatIcon, SendOutlined as SendIcon, Create as CreateIcon } from '@mui/icons-material';
import { ReactionPicker } from '../shared/reaction-picker';
import { ReactionIcon } from '../shared/reaction-icon';
import { useAppDispatch } from '@/app/store';
import { toggleLikeThunk, repostThunk } from '@/features/post/post.action';
import { useSnackbar } from 'notistack';
import styles from './post-card.module.css';

interface PostActionsProps {
  postId: string;
  liked: boolean;
  isReposted: boolean;
  selectedReaction: string;
  onLikedChange: (liked: boolean, count: number) => void;
  onReactionChange: (reaction: string) => void;
  onRepostedChange: (isReposted: boolean, countChange: number) => void;
  onToggleComments: () => void;
  onOpenRepostDialog: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  postId,
  liked,
  isReposted,
  selectedReaction,
  onLikedChange,
  onReactionChange,
  onRepostedChange,
  onToggleComments,
  onOpenRepostDialog,
}) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [showReactionSelector, setShowReactionSelector] = useState(false);
  const [repostMenuAnchor, setRepostMenuAnchor] = useState<null | HTMLElement>(null);

  const handleToggleLike = async (reactionOverride?: string) => {
    try {
      const reactionToSend = reactionOverride || selectedReaction || 'like';
      const res = await dispatch(toggleLikeThunk({ postId, reaction: reactionToSend })).unwrap();
      onLikedChange(res.liked, res.likesCount);
      if (res.liked && res.reaction) {
        onReactionChange(res.reaction);
      }
    } catch (err: unknown) {
      enqueueSnackbar((err as { message?: string }).message || 'Failed to toggle like', {
        variant: 'error',
      });
    }
  };

  const handleInstantRepost = async () => {
    setRepostMenuAnchor(null);
    try {
      const res = await dispatch(repostThunk({ postId })).unwrap();
      onRepostedChange(res.isReposted, res.isReposted ? 1 : -1);
      enqueueSnackbar(res.message || 'Repost updated', { variant: 'success' });
    } catch (err: unknown) {
      enqueueSnackbar((err as { message?: string }).message || 'Failed to repost', {
        variant: 'error',
      });
    }
  };

  return (
    <Box className={styles.actionButtonsRow}>
      <Box className={styles.reactionWrapper} onMouseEnter={() => setShowReactionSelector(true)} onMouseLeave={() => setShowReactionSelector(false)}>
        {showReactionSelector && (
          <ReactionPicker
            onSelect={async (label) => {
              onReactionChange(label);
              setShowReactionSelector(false);
              await handleToggleLike(label);
            }}
          />
        )}
        <Button onClick={() => handleToggleLike()} className={liked ? styles.likedButton : styles.postButtons}>
          <ReactionIcon reaction={selectedReaction} liked={liked} width={16} height={16} />
          {liked && selectedReaction ? selectedReaction.charAt(0).toUpperCase() + selectedReaction.slice(1) : 'Like'}
        </Button>
      </Box>

      <Button onClick={onToggleComments} className={styles.postButtons}>
        <CommentIcon className={styles.icon} />
        Comment
      </Button>

      <Button onClick={(e) => setRepostMenuAnchor(e.currentTarget)} className={isReposted ? styles.repostedButton : styles.postButtons}>
        <RepeatIcon className={`${isReposted ? styles.repostedIcon : undefined} ${styles.icon}`} />
        Repost
      </Button>

      <Button className={styles.postButtons}>
        <SendIcon className={styles.icon} />
        Send
      </Button>

      <Menu anchorEl={repostMenuAnchor} open={Boolean(repostMenuAnchor)} onClose={() => setRepostMenuAnchor(null)}>
        <MenuItem onClick={handleInstantRepost} className={styles.menuItem}>
          <RepeatIcon fontSize="small" color={isReposted ? 'success' : 'action'} />
          <Box>
            <Typography variant="subtitle2" className={styles.menuTitle}>
              {isReposted ? 'Undo Repost' : 'Repost'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Instantly share this post with your network
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setRepostMenuAnchor(null);
            onOpenRepostDialog();
          }}
          className={styles.menuItem}
        >
          <CreateIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="subtitle2" className={styles.menuTitle}>
              Repost with your thoughts
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Add your own comments before sharing
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};
