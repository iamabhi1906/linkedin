import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postService, CreatePostPayload } from '@/services/posts/post.service';

export const fetchFeedThunk = createAsyncThunk(
  'post/fetchFeed',
  async ({ page, limit }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const data = await postService.getFeed(page, limit);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch feed');
    }
  },
);

export const createPostThunk = createAsyncThunk(
  'post/createPost',
  async (payload: CreatePostPayload, { rejectWithValue }) => {
    try {
      const data = await postService.create(payload);
      return data.post;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create post');
    }
  },
);

export const toggleLikeThunk = createAsyncThunk(
  'post/toggleLike',
  async (postId: string, { rejectWithValue }) => {
    try {
      const data = await postService.toggleLike(postId);
      return { postId, ...data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle like');
    }
  },
);

interface PostState {
  posts: any[];
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
