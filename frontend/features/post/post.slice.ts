import { createSlice } from '@reduxjs/toolkit';

import { Post } from './post.type';
import { createPostThunk, fetchFeedThunk, toggleLikeThunk } from './post.action';

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
        }
      });
  },
});

export default postSlice.reducer;
