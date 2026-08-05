'use client';

import { useState } from 'react';
import { Avatar, Button, Chip, Container, Menu, MenuItem, Stack, Toolbar } from '@mui/material';
import LinkedInLogo from './linkedin-logo';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { AppDispatch, RootState } from '@/app/store';
import { logoutThunk } from '@/features/auth/auth.action';

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <Container>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <LinkedInLogo height={400} width={500} />

        {user ? (
          <>
            <Chip avatar={<Avatar>{user?.name?.charAt(0)}</Avatar>} label={user?.name} onClick={handleOpen} clickable />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" size="large" href="/signin" LinkComponent={Link}>
              Sign in
            </Button>

            <Button variant="contained" size="large" href="/signup" LinkComponent={Link}>
              Join now
            </Button>
          </Stack>
        )}
      </Toolbar>
    </Container>
  );
}
