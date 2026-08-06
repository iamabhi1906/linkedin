'use client';

import React from 'react';
import { Avatar, Box, Button, Card, Divider, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import styles from './profile-sidebar.module.css';

import { User } from '@/features/user/user.type';

interface ProfileSidebarProps {
  profile?: User | null;
  isOwnProfile?: boolean;
}

export default function ProfileSidebar({ profile, isOwnProfile = true }: ProfileSidebarProps) {
  const viewers = [
    { name: 'Software Development Lead', role: 'Tech Founder at Zenmonk', initial: 'S' },
    { name: 'Alumni Network Member', role: 'Lovely Professional University', initial: 'A' },
    { name: 'Executive Team Member', role: 'Executive at Zenvest', initial: 'E' },
  ];

  const profileUrl = profile?.username
    ? `www.linkedin.com/in/${profile.username}`
    : 'www.linkedin.com/in/user';

  return (
    <Box className={styles.container}>
      <Card elevation={0} className={styles.card}>
        <Box className={styles.cardHeader}>
          <Typography className={styles.cardTitle}>Profile language</Typography>
          {isOwnProfile && (
            <IconButton className={styles.editBtn}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Typography className={styles.subText}>English</Typography>
      </Card>

      <Card elevation={0} className={styles.card}>
        <Box className={styles.cardHeader}>
          <Typography className={styles.cardTitle}>Public profile & URL</Typography>
          {isOwnProfile && (
            <IconButton className={styles.editBtn}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Typography className={styles.subText}>{profileUrl}</Typography>
      </Card>

      <Card elevation={0} className={styles.card}>
        <Typography className={styles.cardTitle}>People also viewed</Typography>
        {isOwnProfile && (
          <Typography className={styles.privateSubtitle}>
            <LockIcon sx={{ fontSize: 14 }} /> Private to you
          </Typography>
        )}

        <Box className={styles.viewerList}>
          {viewers.map((v, idx) => (
            <React.Fragment key={idx}>
              <Box className={styles.viewerItem}>
                <Box className={styles.viewerLeft}>
                  <Avatar className={styles.viewerAvatar}>{v.initial}</Avatar>
                  <Box className={styles.viewerInfo}>
                    <Typography className={styles.viewerName}>{v.name}</Typography>
                    <Typography className={styles.viewerRole}>{v.role}</Typography>
                  </Box>
                </Box>
                <Button variant="outlined" className={styles.viewBtn}>
                  View
                </Button>
              </Box>
              {idx < viewers.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </Box>
      </Card>
    </Box>
  );
}
