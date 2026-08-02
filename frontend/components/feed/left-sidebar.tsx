'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { Bookmark as BookmarkIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useSession } from 'next-auth/react';

export default function LeftSidebar() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: session } = useSession();

  const currentUser = user || session?.user;

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          height: 60,
          background: 'linear-gradient(135deg, #A0B4B7 0%, #C4D3D5 100%)',
          position: 'relative',
        }}
      />

      <CardContent sx={{ textAlign: 'center', pt: 0, pb: 2 }}>
        <Avatar
          src={currentUser?.profilePicture || currentUser?.coverPicture}
          onClick={() => router.push('/profile')}
          sx={{
            width: 64,
            height: 64,
            margin: '-32px auto 8px auto',
            border: '2px solid #FFFFFF',
            cursor: 'pointer',
            fontSize: '1.5rem',
            backgroundColor: '#0A66C2',
          }}
        >
          {currentUser?.firstName?.[0] || currentUser?.name?.[0] || 'U'}
        </Avatar>

        <Typography
          variant="subtitle1"
          onClick={() => router.push('/profile')}
          sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          {currentUser?.firstName
            ? `${currentUser.firstName} ${currentUser.lastName || ''}`
            : currentUser?.name || 'Welcome!'}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
          {currentUser?.headline || 'Software Engineer at LinkedIn'}
        </Typography>
      </CardContent>

      <Divider />

      <Box sx={{ py: 1.5, px: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Profile viewers
          </Typography>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
            142
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Post impressions
          </Typography>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
            1,280
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          py: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#F3F2EF' },
        }}
      >
        <BookmarkIcon sx={{ fontSize: 18, color: '#666666' }} />
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1D2226' }}>
          Saved items
        </Typography>
      </Box>
    </Card>
  );
}
