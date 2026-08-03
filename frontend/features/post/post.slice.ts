import { createSlice } from '@reduxjs/toolkit';

import { Post } from './post.type';
import { createPostThunk, fetchFeedThunk, toggleLikeThunk, repostThunk } from './post.action';

interface PostState {
  posts: Post[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  total: 0,
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchFeedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(toggleLikeThunk.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          post.likesCount = action.payload.likesCount;
          post.isLiked = action.payload.isLiked;
        }
      })
      .addCase(repostThunk.fulfilled, (state, action) => {
        const { postId, post: newPost, isReposted } = action.payload;
        
        // Find targeted post in current feed state
        const targetPost = state.posts.find((p) => p.id === postId || p.originalPostId === postId);
        if (targetPost) {
          targetPost.isReposted = isReposted;
          targetPost.repostsCount = isReposted
            ? (targetPost.repostsCount || 0) + 1
            : Math.max(0, (targetPost.repostsCount || 0) - 1);
        }

        if (newPost && isReposted) {
          state.posts.unshift(newPost);
        }
      });
  },
});

export default postSlice.reducer;
