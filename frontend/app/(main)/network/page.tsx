'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Card,
  CircularProgress,
  Container,
  InputBase,
  Pagination,
  Typography,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Campaign as FollowersIcon,
} from '@mui/icons-material';
import { userService } from '@/services/users/user.service';
import { followService } from '@/services/follows/follow.service';
import UserCard, { UserCardData } from '@/components/network/user-card';
import UserListModal from '@/components/network/user-list-modal';
import styles from './network.module.css';

export default function NetworkPage() {
  const [users, setUsers] = useState<UserCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Network stats
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'followers' | 'following'>('followers');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.search(searchQuery, page, 12);
      setUsers(res.users || []);
      setTotalPages(res.totalPages || 1);
      setTotalUsers(res.total || 0);
    } catch {
      // Handled quietly
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page]);

  const fetchStats = useCallback(async () => {
    try {
      const [followersRes, followingRes, pendingRes] = await Promise.all([
        followService.getFollowers(undefined, 1, 1),
        followService.getFollowing(undefined, 1, 1),
        followService.getPendingRequests(1, 1),
      ]);
      setFollowersCount(followersRes.meta?.total || 0);
      setFollowingCount(followingRes.meta?.total || 0);
      setPendingCount(pendingRes.meta?.total || 0);
    } catch {
      // Handled quietly
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const openListModal = (tab: 'followers' | 'following') => {
    setModalTab(tab);
    setModalOpen(true);
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '280px' }, flexShrink: 0 }}>
          <Card elevation={0} className={styles.sidebarCard}>
            <Typography variant="subtitle2" className={styles.sidebarHeader}>
              Manage my network
            </Typography>

            <Box
              className={styles.sidebarItem}
              onClick={() => openListModal('following')}
            >
              <Box className={styles.sidebarItemText}>
                <PeopleIcon fontSize="small" />
                <Typography variant="body2">Following</Typography>
              </Box>
              <Typography variant="body2" className={styles.sidebarCount}>
                {followingCount}
              </Typography>
            </Box>

            <Box
              className={styles.sidebarItem}
              onClick={() => openListModal('followers')}
            >
              <Box className={styles.sidebarItemText}>
                <FollowersIcon fontSize="small" />
                <Typography variant="body2">Followers</Typography>
              </Box>
              <Typography variant="body2" className={styles.sidebarCount}>
                {followersCount}
              </Typography>
            </Box>

            {pendingCount > 0 && (
              <Box
                className={styles.sidebarItem}
                onClick={() => openListModal('followers')}
              >
                <Box className={styles.sidebarItemText}>
                  <PersonAddIcon fontSize="small" />
                  <Typography variant="body2">Pending Requests</Typography>
                </Box>
                <Typography variant="body2" className={styles.sidebarCount}>
                  {pendingCount}
                </Typography>
              </Box>
            )}
          </Card>
        </Box>

        {/* Main Section */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={0} className={styles.mainCard}>
            {/* Search Box */}
            <Box className={styles.searchBox}>
              <SearchIcon sx={{ color: '#666666', mr: 1 }} />
              <InputBase
                fullWidth
                placeholder="Search people by name, headline, location..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Box>

            <Box className={styles.sectionHeader}>
              <Typography variant="h6" className={styles.sectionTitle}>
                {searchQuery
                  ? `Search Results (${totalUsers})`
                  : `People you may know (${totalUsers})`}
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : users.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary">
                  No users found matching your search criteria.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 2,
                }}
              >
                {users.map((user) => (
                  <UserCard key={user.id} user={user} onStatusChange={fetchStats} />
                ))}
              </Box>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box className={styles.paginationBox}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="medium"
                />
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* Followers & Following List Modal */}
      <UserListModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchStats();
        }}
        initialTab={modalTab}
      />
    </Container>
  );
}
