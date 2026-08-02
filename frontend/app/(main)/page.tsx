'use client';

import React, { useEffect } from 'react';
import { Box, Grid, CircularProgress, Typography } from '@mui/material';
import LeftSidebar from '@/components/feed/left-sidebar';
import RightSidebar from '@/components/feed/right-sidebar';
import CreatePostCard from '@/components/feed/create-post-card';
import PostCard from '@/components/feed/post-card';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchFeedThunk } from '@/features/post/post.slice';

export default function FeedPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.post);

  useEffect(() => {
    dispatch(fetchFeedThunk({ page: 1, limit: 20 }));
  }, [dispatch]);

  return (
    <Grid container spacing={2.5}>
      {/* Left Column - Mini Profile Card */}
      <Grid size={{ xs: 12, md: 3 }}>
        <LeftSidebar />
      </Grid>

      {/* Center Column - Feed & Post Creation */}
      <Grid size={{ xs: 12, md: 6 }}>
        <CreatePostCard />

        {loading && posts.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
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

      {/* Right Column - LinkedIn News */}
      <Grid size={{ xs: 12, md: 3 }}>
        <RightSidebar />
      </Grid>
    </Grid>
  );
}
