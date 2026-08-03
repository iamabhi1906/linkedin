'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { followService, FollowUser } from '@/services/follows/follow.service';
import { useSnackbar } from 'notistack';

interface UserListModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
  initialTab?: 'followers' | 'following';
}

export default function UserListModal({
  open,
  onClose,
  userId,
  initialTab = 'followers',
}: UserListModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'followers') {
        const res = await followService.getFollowers(userId, page, 10);
        setUsers(res.followers || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.total || 0);
      } else {
        const res = await followService.getFollowing(userId, page, 10);
        setUsers(res.following || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.total || 0);
      }
    } catch {
      enqueueSnackbar('Failed to load network list', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [activeTab, userId, page, enqueueSnackbar]);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open, fetchUsers]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'followers' | 'following') => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handleUnfollow = async (targetId: string) => {
    try {
      await followService.unfollow(targetId);
      enqueueSnackbar('Unfollowed user', { variant: 'success' });
      fetchUsers();
    } catch {
      enqueueSnackbar('Failed to unfollow', { variant: 'error' });
    }
  };

  const handleRemoveFollower = async (followerId: string) => {
    try {
      await followService.removeFollower(followerId);
      enqueueSnackbar('Removed follower', { variant: 'success' });
      fetchUsers();
    } catch {
      enqueueSnackbar('Failed to remove follower', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Network ({totalCount})
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Followers" value="followers" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Following" value="following" sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>
      </Box>

      <DialogContent dividers sx={{ minHeight: 350, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, py: 4 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, py: 4 }}>
            <Typography color="text.secondary">
              No {activeTab} found.
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ flex: 1 }}>
            {users.map((user) => (
              <ListItem
                key={user.id}
                sx={{
                  py: 1.5,
                  borderBottom: '1px solid #F0F0F0',
                  display: 'flex',
                  justify: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ListItemAvatar>
                    <Avatar src={user.profilePicture || undefined} sx={{ backgroundColor: '#0A66C2' }}>
                      {user.name?.[0] || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{user.name}</Typography>}
                    secondary={<Typography variant="caption" color="text.secondary">{user.headline || 'LinkedIn Member'}</Typography>}
                  />
                </Box>

                <Box sx={{ ml: 2 }}>
                  {activeTab === 'following' ? (
                    <Button
                      variant="outlined"
                      size="small"
                      color="inherit"
                      onClick={() => handleUnfollow(user.id)}
                      sx={{ borderRadius: 4, textTransform: 'none', fontSize: '0.78rem' }}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFollower(user.id)}
                      sx={{ borderRadius: 4, textTransform: 'none', fontSize: '0.78rem' }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 1 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="small"
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
