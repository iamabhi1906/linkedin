'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Box, Button, Card, Divider, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GroupsIcon from '@mui/icons-material/Groups';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarsIcon from '@mui/icons-material/Stars';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchOrganizationsThunk } from '@/features/organization/organization.slice';
import styles from './left-sidebar.module.css';
import { Organization } from '@/features/organization/organization.type';

export default function LeftSidebar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const { organizations } = useSelector((state: RootState) => state.organization);

  const currentUser = profile || user;

  useEffect(() => {
    dispatch(fetchOrganizationsThunk());
  }, [dispatch]);

  return (
    <Box className={styles.container}>
      <Card elevation={0} className={styles.profileCard}>
        <Box className={styles.banner} />
        <Box className={styles.profileContent}>
          <Avatar src={currentUser?.profilePicture || undefined} onClick={() => router.push('/profile')} className={styles.avatar}>
            {currentUser?.name?.[0] || 'U'}
          </Avatar>

          <Box className={styles.nameRow} onClick={() => router.push('/profile')}>
            <Typography className={styles.userName}>{currentUser?.name}</Typography>
            <VerifiedIcon className={styles.verifiedBadge} />
          </Box>

          <Typography className={styles.userHeadline}>{currentUser?.headline}</Typography>
        </Box>
      </Card>

      <Box className={styles.orgCard}>
        <Box className={styles.statRow}>
          <Typography className={styles.statLabel}>Profile viewers</Typography>
          <Typography className={styles.statValue}>60</Typography>
        </Box>
        <Box className={styles.statRow}>
          <Typography className={styles.statLabel}>Post impressions</Typography>
          <Typography className={styles.statValue}>12</Typography>
        </Box>
      </Box>

      {organizations.length > 0 ? (
        organizations.map((org: Organization) => (
          <Card key={org.id} elevation={0} className={styles.orgCard}>
            <Box className={styles.orgHeader}>
              <Avatar src={org.logo || undefined} variant="rounded" sx={{ width: 36, height: 36, backgroundColor: '#0A66C2' }}>
                {org.name[0] || 'O'}
              </Avatar>
              <Box>
                <Typography className={styles.orgTitle}>{org.name}</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography className={styles.growthText}>
                    Activity: <strong>{org?.activityCount || 0}</strong>
                  </Typography>
                  <Typography className={styles.growthText}>
                    Visitors: <strong>{org?.visitorsCount || 2}</strong>
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 0.5 }} />

            <Typography className={styles.growthText}>Grow your business faster</Typography>
            <Box className={styles.premiumLink}>
              <StarsIcon sx={{ fontSize: 16 }} />
              Try Premium Page for ₹0
            </Box>
            <Typography className={styles.growthText} sx={{ cursor: 'pointer', '&:hover': { color: '#0A66C2' } }}>
              Advertise on LinkedIn
            </Typography>

            <Divider sx={{ my: 0.5 }} />

            <Box className={styles.analyticsLink} onClick={() => router.push(`/organization/${org.slug || org.id}`)}>
              See visitor analytics <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </Box>
          </Card>
        ))
      ) : (
        <Card elevation={0} className={styles.orgCard}>
          <Box className={styles.orgHeader}>
            <Avatar variant="rounded" sx={{ width: 36, height: 36, backgroundColor: '#0A66C2' }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography className={styles.orgTitle}>My Organizations</Typography>
              <Typography className={styles.growthText}>Manage or post jobs</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => router.push('/organization/new')}
            sx={{
              borderRadius: 5,
              textTransform: 'none',
              fontWeight: 600,
              color: '#0A66C2',
              borderColor: '#0A66C2',
            }}
          >
            Create Organization
          </Button>
        </Card>
      )}

      <Card elevation={0} className={styles.navCard}>
        <Box className={styles.navItem}>
          <BookmarkIcon sx={{ fontSize: 20, color: '#666666' }} />
          <Typography className={styles.navItemText}>Saved items</Typography>
        </Box>

        <Box className={styles.navItem}>
          <GroupsIcon sx={{ fontSize: 20, color: '#666666' }} />
          <Typography className={styles.navItemText}>Groups</Typography>
        </Box>

        <Box className={styles.navItem}>
          <ArticleIcon sx={{ fontSize: 20, color: '#666666' }} />
          <Typography className={styles.navItemText}>Newsletters</Typography>
        </Box>

        <Box className={styles.navItem}>
          <EventIcon sx={{ fontSize: 20, color: '#666666' }} />
          <Typography className={styles.navItemText}>Events</Typography>
        </Box>
      </Card>
    </Box>
  );
}
