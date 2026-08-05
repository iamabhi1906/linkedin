'use client';

import Link from 'next/link';
import { Avatar, Box, Button, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import InsightsIcon from '@mui/icons-material/Insights';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import styles from './jobs-sidebar.module.css';

export default function JobsSidebar() {
  const { profile } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = profile || user;
  console.log(profile);

  const userName = currentUser?.name || 'LinkedIn User';
  const userAvatar = currentUser?.profilePicture;
  const userHeadline = currentUser?.headline;

  return (
    <Box className={styles.container}>
      <Box className={styles.profileCard}>
        <Box className={styles.banner} />
        <Box className={styles.profileBody}>
          <Avatar src={userAvatar ?? undefined} className={styles.avatar}>
            {userName[0] || 'U'}
          </Avatar>
          <Typography className={styles.userName}>{userName}</Typography>
          <Typography className={styles.userHeadline}>{userHeadline}</Typography>
        </Box>
      </Box>

      <Box className={styles.linksCard}>
        <Box className={styles.navLink}>
          <ListAltIcon sx={{ color: '#666666', fontSize: 20 }} />
          <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Preferences
          </Typography>
        </Box>

        <Box className={styles.navLink}>
          <BookmarkIcon sx={{ color: '#666666', fontSize: 20 }} />
          <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Job tracker
          </Typography>
        </Box>

        <Box className={styles.navLink}>
          <InsightsIcon sx={{ color: '#666666', fontSize: 20 }} />
          <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            My Career Insights
          </Typography>
        </Box>

        <Link href="/jobs/new" style={{ textDecoration: 'none' }}>
          <Button variant="outlined" startIcon={<PostAddIcon />} className={styles.postJobBtn}>
            Post a free job
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
