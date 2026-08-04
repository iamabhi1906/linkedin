'use client';

import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import {
  ThumbUpOutlined as LikeIcon,
  ThumbUp as LikedIcon,
  CommentOutlined as CommentIcon,
  Repeat as RepeatIcon,
  SendOutlined as SendIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { FacebookSelector } from '@charkour/react-reactions';
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

  const handleOpenRepostMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRepostMenuAnchor(event.currentTarget);
  };

  const handleCloseRepostMenu = () => {
    setRepostMenuAnchor(null);
  };

  const handleInstantRepost = async () => {
    handleCloseRepostMenu();
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
      <Box
        onMouseEnter={() => setShowReactionSelector(true)}
        onMouseLeave={() => setShowReactionSelector(false)}
        sx={{ position: 'relative', display: 'inline-block' }}
      >
        {showReactionSelector && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '100%',
              left: 20,
              mb: 0,
              zIndex: 100,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: 4,
              backgroundColor: '#ffffff',
              p: 0.5,
            }}
          >
            <FacebookSelector
              onSelect={async (label) => {
                onReactionChange(label);
                setShowReactionSelector(false);
                await handleToggleLike(label);
              }}
            />
          </Box>
        )}
        <Button
          startIcon={liked ? <LikedIcon className={styles.likedIcon} /> : <LikeIcon />}
          onClick={() => handleToggleLike()}
          className={liked ? styles.likedButton : styles.postButtons}
        >
          {liked && selectedReaction ? selectedReaction.charAt(0).toUpperCase() + selectedReaction.slice(1) : 'Like'}
        </Button>
      </Box>

      <Button startIcon={<CommentIcon />} onClick={onToggleComments} className={styles.postButtons}>
        Comment
      </Button>

      <Button
        startIcon={<RepeatIcon className={isReposted ? styles.repostedIcon : undefined} />}
        onClick={handleOpenRepostMenu}
        className={isReposted ? styles.repostedButton : styles.postButtons}
      >
        Repost
      </Button>

      <Button startIcon={<SendIcon />} className={styles.postButtons}>
        Send
      </Button>

      <Menu anchorEl={repostMenuAnchor} open={Boolean(repostMenuAnchor)} onClose={handleCloseRepostMenu}>
        <MenuItem onClick={handleInstantRepost} sx={{ py: 1.5, px: 2, gap: 1.5 }}>
          <RepeatIcon fontSize="small" color={isReposted ? 'success' : 'action'} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {isReposted ? 'Undo Repost' : 'Repost'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Instantly share this post with your network
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseRepostMenu();
            onOpenRepostDialog();
          }}
          sx={{ py: 1.5, px: 2, gap: 1.5 }}
        >
          <CreateIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
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
