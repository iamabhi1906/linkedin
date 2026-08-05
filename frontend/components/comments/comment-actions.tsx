'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ThumbUp as ThumbIcon } from '@mui/icons-material';
import { ReactionPicker } from '../shared/reaction-picker';
import { ReactionIcon } from '../shared/reaction-icon';
import styles from './comment-actions.module.css';

interface CommentActionsProps {
  liked: boolean;
  likesCount: number;
  selectedReaction?: string;
  onToggleLike: (reaction?: string) => void;
  onToggleReply: () => void;
}

export const CommentActions: React.FC<CommentActionsProps> = ({ liked, likesCount, selectedReaction = 'like', onToggleLike, onToggleReply }) => {
  const [showSelector, setShowSelector] = useState(false);

  const displayReactionLabel = liked ? selectedReaction.charAt(0).toUpperCase() + selectedReaction.slice(1) : 'Like';

  return (
    <Box className={styles.actionsContainer}>
      <Box className={styles.reactionWrapper} onMouseEnter={() => setShowSelector(true)} onMouseLeave={() => setShowSelector(false)}>
        {showSelector && (
          <ReactionPicker
            onSelect={(reaction) => {
              setShowSelector(false);
              onToggleLike(reaction);
            }}
          />
        )}
        <button type="button" className={liked ? styles.likedBtn : styles.actionBtn} onClick={() => onToggleLike()}>
          <Box className={styles.buttonContent}>
            <ReactionIcon reaction={selectedReaction} liked={liked} />
            <span>{displayReactionLabel}</span>
          </Box>
        </button>
      </Box>

      <span className={styles.separator}>|</span>

      <button type="button" className={styles.actionBtn} onClick={onToggleReply}>
        Reply
      </button>

      {likesCount > 0 && (
        <Box className={styles.likesCountBadge}>
          <Box className={styles.likeIconPill}>
            <ThumbIcon style={{ fontSize: 9 }} />
          </Box>
          <Typography component="span" variant="caption">
            {likesCount}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
