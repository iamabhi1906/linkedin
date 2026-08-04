'use client';

import React from 'react';
import { Box, Skeleton } from '@mui/material';
import styles from './comment-skeleton.module.css';

export const CommentSkeleton: React.FC = () => {
  return (
    <Box className={styles.skeletonContainer}>
      {[1, 2].map((key) => (
        <Box key={key} className={styles.skeletonItem}>
          <Skeleton variant="circular" className={styles.skeletonAvatar} />
          <Box className={styles.skeletonBody}>
            <Skeleton variant="text" className={styles.skeletonLineShort} />
            <Skeleton variant="text" className={styles.skeletonLineMedium} />
            <Skeleton variant="text" className={styles.skeletonLineFull} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
