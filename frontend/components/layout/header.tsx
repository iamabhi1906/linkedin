'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AppBar, Avatar, Box, Container, InputBase, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { logoutThunk } from '@/features/auth/auth.action';
import { signOut, useSession } from 'next-auth/react';
import LinkedInLogo from '../linkedin-logo';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: session } = useSession();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentUser = user || session?.user;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseMenu();
    await dispatch(logoutThunk());
    await signOut({ callbackUrl: '/signin' });
    router.push('/signin');
  };

  const navItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'My Network', icon: <PeopleIcon />, path: '/network' },
    { label: 'Jobs', icon: <WorkIcon />, path: '/jobs' },
    { label: 'Messaging', icon: <MessageIcon />, path: '/messaging' },
    { label: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  ];

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid #E0E0E0',
        backgroundColor: '#FFFFFF',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 52, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <LinkedInLogo width={34} height={34} />
            </Link>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#EDF3F8',
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                width: { xs: 160, sm: 260 },
              }}
            >
              <SearchIcon sx={{ color: '#666666', mr: 1, fontSize: 20 }} />
              <InputBase placeholder="Search" sx={{ fontSize: '0.875rem', width: '100%' }} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
            {navItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  style={{
                    textDecoration: 'none',
                    color: active ? '#000000' : '#666666',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderBottom: active ? '2px solid #000000' : '2px solid transparent',
                    paddingBottom: 2,
                    paddingTop: 4,
                  }}
                >
                  {React.cloneElement(item.icon, {
                    sx: { fontSize: 24, color: active ? '#1D2226' : '#666666' },
                  })}
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
                      display: { xs: 'none', md: 'block' },
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              );
            })}

            <Box
              onClick={handleOpenMenu}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 0.5,
              }}
            >
              <Avatar src={currentUser?.profilePicture || (session?.user?.image ?? undefined)} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {currentUser?.name?.[0] || 'U'}
              </Avatar>
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#666666', display: { xs: 'none', md: 'block' } }}>
                Me ▾
              </Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  router.push('/profile');
                }}
              >
                View Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  router.push('/organization/new');
                }}
              >
                Create Organization Page
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                Sign Out
              </MenuItem>
            </Menu>

            <Box
              onClick={() => router.push('/jobs/new')}
              sx={{
                cursor: 'pointer',
                display: { xs: 'none', lg: 'flex' },
                flexDirection: 'column',
                alignItems: 'center',
                borderLeft: '1px solid #E0E0E0',
                pl: 2,
              }}
            >
              <BusinessIcon sx={{ fontSize: 24, color: '#915907' }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#915907' }}>
                Post a Job
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
