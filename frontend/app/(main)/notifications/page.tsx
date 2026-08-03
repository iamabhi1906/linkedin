'use client';

import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { NotificationsNone as EmptyIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import {
  followService,
  PendingFollowRequest,
} from '@/services/follows/follow.service';
import styles from './notifications.module.css';

export default function NotificationsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [requests, setRequests] = useState<PendingFollowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const res = await followService.getPendingRequests();
      setRequests(res.requests || []);
    } catch {
      enqueueSnackbar('Failed to load notifications', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await followService.acceptRequest(requestId);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      enqueueSnackbar('Follow request accepted', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to accept follow request', { variant: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await followService.rejectRequest(requestId);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      enqueueSnackbar('Follow request rejected', { variant: 'info' });
    } catch {
      enqueueSnackbar('Failed to reject follow request', { variant: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <Card elevation={0} className={styles.notificationsCard}>
        <Box className={styles.cardHeader}>
          <Typography variant="h6" className={styles.headerTitle}>
            Notifications & Follow Requests
          </Typography>
        </Box>

        <CardContent className={styles.cardBody}>
          {loading ? (
            <Box className={styles.loadingBox}>
              <CircularProgress color="primary" />
            </Box>
          ) : requests.length === 0 ? (
            <Box className={styles.emptyStateBox}>
              <EmptyIcon className={styles.emptyIcon} />
              <Typography variant="subtitle1" className={styles.emptyTitle}>
                No pending requests
              </Typography>
              <Typography variant="body2" className={styles.emptyText}>
                You have no pending follow requests at this time.
              </Typography>
            </Box>
          ) : (
            requests.map((item) => {
              const follower = item.follower;
              const isProcessing = actionLoading === item.id;
              return (
                <Box key={item.id} className={styles.requestItem}>
                  <Box className={styles.userInfoBox}>
                    <Avatar
                      src={follower.profilePicture}
                      className={styles.userAvatar}
                    >
                      {follower.name?.[0] || 'U'}
                    </Avatar>
                    <Box className={styles.userDetails}>
                      <Typography variant="subtitle2" className={styles.userName}>
                        {follower.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={styles.userHeadline}
                      >
                        {follower.headline || 'LinkedIn Member'}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={styles.requestTime}
                      >
                        Wants to follow you •{' '}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className={styles.actionButtons}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={isProcessing}
                      onClick={() => handleAccept(item.id)}
                      className={styles.acceptButton}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={isProcessing}
                      onClick={() => handleReject(item.id)}
                      className={styles.rejectButton}
                    >
                      Reject
                    </Button>
                  </Box>
                </Box>
              );
            })
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
