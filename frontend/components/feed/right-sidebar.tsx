'use client';

import { useState } from 'react';
import { Box, Button, Card, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import styles from './right-sidebar.module.css';

export default function RightSidebar() {
  const [showMoreNews, setShowMoreNews] = useState(false);
  const [showMorePuzzles, setShowMorePuzzles] = useState(false);

  const newsItems = [
    { title: 'CWG 2026: India finishes with 39 medals', time: '3h ago', readers: '6,491 readers' },
    { title: 'Family offices raise the stakes for talent', time: '4h ago', readers: '3,134 readers' },
    { title: 'AI is making data breaches costlier', time: '4h ago', readers: '1,152 readers' },
    { title: 'Firms step up festive hiring plans', time: '4h ago', readers: '521 readers' },
    { title: "Hurun spotlights India's top women ...", time: '2d ago', readers: '980 readers' },
    { title: 'Global Tech Startups see Q3 investment boost', time: '3d ago', readers: '4,210 readers' },
  ];

  const puzzleItems = [
    { id: 'werd', name: 'Werd #56', iconBg: '#c28b12', label: 'WE', stat: '3 connections played' },
    { id: 'zip', name: 'Zip #504', iconBg: '#d94814', label: 'DN', stat: '6 connections played' },
    { id: 'patches', name: 'Patches #139', iconBg: '#0a66c2', label: 'PA', stat: '4 connections played' },
    { id: 'sudoku', name: 'Mini Sudoku #357', iconBg: '#137333', label: 'SU', stat: '3 connections played' },
  ];

  const visibleNews = showMoreNews ? newsItems : newsItems.slice(0, 5);

  return (
    <Box className={styles.container}>
      <Card elevation={0} className={styles.newsCard}>
        <Box className={styles.cardHeader}>
          <Typography className={styles.cardTitle}>LinkedIn News</Typography>
          <InfoIcon className={styles.infoIcon} />
        </Box>

        <Typography className={styles.subTitle}>Top stories</Typography>

        <Box className={styles.newsList}>
          {visibleNews.map((item, idx) => (
            <Box key={idx} className={styles.newsItem}>
              <Typography className={styles.storyTitle}>{item.title}</Typography>
              <Typography className={styles.storyMeta}>
                {item.time} • {item.readers}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          startIcon={showMoreNews ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          className={styles.showMoreBtn}
          onClick={() => setShowMoreNews(!showMoreNews)}
        >
          {showMoreNews ? 'Show less' : 'Show more news'}
        </Button>
      </Card>

      <Card elevation={0} className={styles.puzzleCard}>
        <Typography className={styles.cardTitle} sx={{ mb: 1.5 }}>
          Today&apos;s puzzles
        </Typography>

        <Box className={styles.puzzleList}>
          {puzzleItems.map((p) => (
            <Box key={p.id} className={styles.puzzleItem}>
              <Box className={styles.puzzleLeft}>
                <Box className={styles.puzzleIcon} sx={{ backgroundColor: p.iconBg }}>
                  {p.label}
                </Box>
                <Box>
                  <Typography className={styles.puzzleTitle}>{p.name}</Typography>
                  <Typography className={styles.puzzleMeta}>{p.stat}</Typography>
                </Box>
              </Box>
              <ChevronRightIcon sx={{ fontSize: 20, color: '#666666' }} />
            </Box>
          ))}
        </Box>

        <Button
          startIcon={showMorePuzzles ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          className={styles.showMoreBtn}
          onClick={() => setShowMorePuzzles(!showMorePuzzles)}
        >
          {showMorePuzzles ? 'Show less' : 'Show more'}
        </Button>
      </Card>
    </Box>
  );
}
