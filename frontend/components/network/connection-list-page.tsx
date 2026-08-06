'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Pagination,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import { followService, FollowUser } from '@/services/follows/follow.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useSnackbar } from 'notistack';
import styles from './connection-list-page.module.css';

interface ConnectionListPageProps {
  type: 'followers' | 'following';
}

export default function ConnectionListPage({ type }: ConnectionListPageProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Menu state for user item actions
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<FollowUser | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (type === 'followers') {
        const res = await followService.getFollowers(undefined, page, 10);
        setUsers(res.followers || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.total || 0);
      } else {
        const res = await followService.getFollowing(undefined, page, 10);
        setUsers(res.following || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.total || 0);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
    } finally {
      setLoading(false);
    }
  }, [type, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, user: FollowUser) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleUnfollowUser = async () => {
    if (!selectedUser) return;
    try {
      await followService.unfollow(selectedUser.id);
      enqueueSnackbar(`Unfollowed ${selectedUser.name}`, { variant: 'info' });
      fetchData();
    } catch {
      enqueueSnackbar('Failed to unfollow user', { variant: 'error' });
    } finally {
      handleCloseMenu();
    }
  };

  const handleRemoveFollower = async () => {
    if (!selectedUser) return;
    try {
      await followService.removeFollower(selectedUser.id);
      enqueueSnackbar(`Removed ${selectedUser.name} from followers`, { variant: 'info' });
      fetchData();
    } catch {
      enqueueSnackbar('Failed to remove follower', { variant: 'error' });
    } finally {
      handleCloseMenu();
    }
  };

  const handleCopyProfileLink = () => {
    if (!selectedUser) return;
    const url = `${window.location.origin}/in/${selectedUser.username || selectedUser.id}`;
    navigator.clipboard.writeText(url);
    enqueueSnackbar('Profile link copied to clipboard!', { variant: 'success' });
    handleCloseMenu();
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.headline?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q);
  });

  const pageTitle = type === 'followers' ? `${totalCount} followers` : `${totalCount} following`;

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Box className={styles.layoutRow}>
        {/* Main Content Area */}
        <Box className={styles.mainContent}>
          <Card elevation={0} className={styles.mainCard}>
            {/* Header & Controls Bar */}
            <Box className={styles.headerBar}>
              <Typography className={styles.pageTitle}>{pageTitle}</Typography>

              <Box className={styles.controlsRow}>
                <Box className={styles.sortBox}>
                  <Typography className={styles.sortLabel}>Sort by:</Typography>
                  <Typography className={styles.sortSelect}>Recently added</Typography>
                </Box>

                <Box className={styles.searchAndFilterGroup}>
                  <OutlinedInput
                    className={styles.searchField}
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon className={styles.searchIcon} />
                      </InputAdornment>
                    }
                  />
                  <Button className={styles.filterLinkBtn}>Search with filters</Button>
                </Box>
              </Box>
            </Box>

            {/* List of Users */}
            {loading ? (
              <Box className={styles.loadingBox}>
                <CircularProgress color="primary" />
              </Box>
            ) : filteredUsers.length === 0 ? (
              <Box className={styles.emptyState}>
                <Typography className={styles.emptyText}>
                  {searchQuery
                    ? 'No matching users found.'
                    : type === 'followers'
                      ? 'You do not have any followers yet.'
                      : 'You are not following anyone yet.'}
                </Typography>
              </Box>
            ) : (
              <Box className={styles.userList}>
                {filteredUsers.map((user) => {
                  const profileUrl = `/in/${user.username || user.id}`;
                  return (
                    <Box key={user.id} className={styles.userRow}>
                      <Link href={profileUrl}>
                        <Avatar src={user.profilePicture || undefined} className={styles.userAvatar}>
                          {user.name?.[0] || 'U'}
                        </Avatar>
                      </Link>

                      <Box className={styles.userInfo}>
                        <Typography className={styles.userName} component={Link} href={profileUrl}>
                          {user.name}
                        </Typography>
                        <Typography className={styles.userHeadline}>{user.headline || 'LinkedIn Member'}</Typography>
                        <Typography className={styles.userSubtext}>{type === 'followers' ? 'Follows you' : 'Following'}</Typography>
                      </Box>

                      <Box className={styles.userActions}>
                        <Button variant="outlined" className={styles.messageBtn} onClick={() => router.push(`/messaging?userId=${user.id}`)}>
                          Message
                        </Button>
                        <IconButton className={styles.moreOptionsBtn} onClick={(e) => handleOpenMenu(e, user)}>
                          <MoreHorizIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}

            {totalPages > 1 && (
              <Box className={styles.paginationBox}>
                <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" size="medium" />
              </Box>
            )}
          </Card>
        </Box>

        {/* Right Sidebar */}
        <Box className={styles.rightSidebar}>
          {/* Ad Box */}
          <Card elevation={0} className={styles.adCard}>
            <Box className={styles.adHeaderRow}>
              <Typography className={styles.adTitleText}>Ad</Typography>
              <IconButton size="small" className={styles.moreOptionsBtn}>
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography className={styles.adSubtitleText}>Hiring Pro prescreens applicants so you can focus on the best fits.</Typography>

            <Box className={styles.adAvatarCluster}>
              <Avatar src={currentUser?.profilePicture || undefined} className={styles.adUserAvatar}>
                {currentUser?.name?.[0] || 'U'}
              </Avatar>
              {/* <Avatar className={styles.adLogoAvatar}>
                <Typography className={styles.linkedinLogoText}>in</Typography>
              </Avatar> */}
            </Box>

            <Typography className={styles.adUserPrompt}>{currentUser?.name}, stop sorting. Start hiring.</Typography>

            <Button variant="outlined" className={styles.postJobBtn}>
              Post a free job
            </Button>
          </Card>

          {/* Footer Links */}
          <Box className={styles.footerLinksBox}>
            <Box className={styles.footerLinksRow}>
              <a className={styles.footerLink}>About</a>
              <a className={styles.footerLink}>Accessibility</a>
              <a className={styles.footerLink}>Help Center</a>
              <a className={styles.footerLink}>Privacy & Terms</a>
              <a className={styles.footerLink}>Ad Choices</a>
              <a className={styles.footerLink}>Advertising</a>
              <a className={styles.footerLink}>Business Services</a>
              <a className={styles.footerLink}>Get the LinkedIn app</a>
              <a className={styles.footerLink}>More</a>
            </Box>

            <Box className={styles.copyrightRow}>
              <span className={styles.linkedinLogoText}>Linked</span>
              <span className={styles.linkedinLogoText}>in</span>
              <span>LinkedIn Corporation © 2026</span>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* User Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {type === 'following' ? (
          <MenuItem onClick={handleUnfollowUser}>
            <ListItemIcon>
              <PersonAddDisabledIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Unfollow</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleRemoveFollower}>
            <ListItemIcon>
              <PersonRemoveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Remove follower</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleCopyProfileLink}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy link to profile</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
}
