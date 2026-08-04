'use client';

import React from 'react';
import {
  ThumbUp as LikeIcon,
  ThumbUpOutlined as DefaultLikeIcon,
  Favorite as LoveIcon,
  Celebration as CelebrateIcon,
  VolunteerActivism as SupportIcon,
  Lightbulb as InsightfulIcon,
  SentimentSatisfiedAlt as FunnyIcon,
} from '@mui/icons-material';
import styles from './reaction-icon.module.css';

interface ReactionIconProps {
  reaction?: string;
  liked?: boolean;
}

export const ReactionIcon: React.FC<ReactionIconProps> = ({ reaction, liked }) => {
  if (!liked) {
    return <DefaultLikeIcon className={styles.defaultIcon} />;
  }

  const key = reaction?.toLowerCase() || 'like';

  switch (key) {
    case 'like':
    case 'likes':
      return <LikeIcon className={styles.likeIcon} />;
    case 'love':
      return <LoveIcon className={styles.loveIcon} />;
    case 'celebrate':
      return <CelebrateIcon className={styles.celebrateIcon} />;
    case 'support':
      return <SupportIcon className={styles.supportIcon} />;
    case 'insightful':
      return <InsightfulIcon className={styles.insightfulIcon} />;
    case 'funny':
    case 'haha':
      return <FunnyIcon className={styles.funnyIcon} />;
    default:
      return <LikeIcon className={styles.likeIcon} />;
  }
};
