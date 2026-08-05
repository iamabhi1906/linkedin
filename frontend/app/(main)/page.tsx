'use client';

import React, { useEffect } from 'react';
import { Box, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LeftSidebar from '@/components/feed/left-sidebar';
import RightSidebar from '@/components/feed/right-sidebar';
import CreatePostCard from '@/components/feed/create-post-card';
import PostCard from '@/components/feed/post-card';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchFeedThunk } from '@/features/post/post.action';

export default function FeedPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.post);

  useEffect(() => {
    dispatch(fetchFeedThunk({ page: 1, limit: 20 }));
  }, [dispatch]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 2.5 }}>
        <LeftSidebar />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CreatePostCard />

        <Box sx={{ display: 'flex', alignItems: 'center', my: 1.5, gap: 1 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="caption" sx={{ color: '#666666', fontSize: '0.75rem' }}>
            Sort by:
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              color: '#1D2226',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            Top <ArrowDropDownIcon sx={{ fontSize: 18 }} />
          </Typography>
        </Box>

        {loading && posts.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : posts.length === 0 ? (
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: 3,
              p: 4,
              textAlign: 'center',
              border: '1px solid #E0E0E0',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No posts in feed yet. Start by sharing a post!
            </Typography>
          </Box>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <RightSidebar />
      </Grid>
    </Grid>
  );
}
