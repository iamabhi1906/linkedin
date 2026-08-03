import { postService } from '@/services/posts/post.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreatePostPayload } from './post.type';

export const fetchFeedThunk = createAsyncThunk('post/fetchFeed', async ({ page, limit }: { page?: number; limit?: number }, { rejectWithValue }) => {
  try {
    const data = await postService.getFeed(page, limit);
    return data;
  } catch (err: unknown) {
    return rejectWithValue((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch feed');
  }
});

export const createPostThunk = createAsyncThunk('post/createPost', async (payload: CreatePostPayload, { rejectWithValue }) => {
  try {
    const data = await postService.create(payload);
    return data.post;
  } catch (err: unknown) {
    return rejectWithValue((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create post');
  }
});

export const toggleLikeThunk = createAsyncThunk('post/toggleLike', async (postId: string, { rejectWithValue }) => {
  try {
    const data = await postService.toggleLike(postId);
    return { postId, ...data };
  } catch (err: unknown) {
    return rejectWithValue((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to toggle like');
  }
});
