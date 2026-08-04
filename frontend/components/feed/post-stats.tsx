'use client';

import React, { JSX } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { ReactionCounter, ReactionCounterObject } from '@charkour/react-reactions';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import styles from './post-card.module.css';

interface PostStatsProps {
  likesCount: number;
  liked: boolean;
  selectedReaction: string;
  repostsCount: number;
  commentsCount: number;
  reactionCounts: {
    reaction: string;
    count: number;
  }[];
  onToggleComments: () => void;
}

export const PostStats: React.FC<PostStatsProps> = ({ likesCount, repostsCount, commentsCount, reactionCounts, onToggleComments }) => {
  const reactionIcons: Record<string, JSX.Element> = {
    like: <span>👍</span>,
    love: <span>❤️</span>,
    laugh: <span>😂</span>,
    wow: <span>😮</span>,
    sad: <span>😢</span>,
    angry: <span>😡</span>,
  };

  const reactionCounters: ReactionCounterObject[] = reactionCounts.map(({ reaction, count }) => ({
    node: reactionIcons[reaction] ?? <span>👍</span>,
    label: String(count),
    by: reaction,
  }));

  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  return (
    <Box className={styles.statsRow}>
      {likesCount > 0 ? (
        <ReactionCounter reactions={reactionCounters} user={currentUser?.name} />
      ) : (
        <Stack direction="row" spacing={1} className={styles.likesCountBox}>
          <ThumbUpIcon color="primary" className={styles.likeIconSmall} />
          <Typography variant="body2" className={styles.statsText}>
            0 likes
          </Typography>
        </Stack>
      )}
      <Stack direction="row" spacing={2}>
        {repostsCount > 0 && (
          <Typography variant="caption" className={styles.statsText}>
            {repostsCount} reposts
          </Typography>
        )}
        <Typography variant="caption" onClick={onToggleComments} className={styles.commentsCountText}>
          {commentsCount} comments
        </Typography>
      </Stack>
    </Box>
  );
};
