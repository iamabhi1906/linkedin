import { postService } from '@/services/posts/post.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreatePostPayload } from './post.type';
import axios from 'axios';

export const fetchFeedThunk = createAsyncThunk(
  'post/fetchFeed',
  async ({ page, limit }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const data = await postService.getFeed(page, limit);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch feed');
      }
      return rejectWithValue('Failed to fetch feed');
    }
  },
);

export const createPostThunk = createAsyncThunk(
  'post/createPost',
  async (payload: CreatePostPayload, { rejectWithValue }) => {
    try {
      const data = await postService.create(payload);
      return data.post;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || 'Failed to create post');
      }
      return rejectWithValue('Failed to create post');
    }
  },
);

export const toggleLikeThunk = createAsyncThunk(
  'post/toggleLike',
  async (postId: string, { rejectWithValue }) => {
    try {
      const data = await postService.toggleLike(postId);
      return { postId, ...data };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || 'Failed to toggle like');
      }
      return rejectWithValue('Failed to toggle like');
    }
  },
);

export const repostThunk = createAsyncThunk(
  'post/repost',
  async (
    { postId, content }: { postId: string; content?: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await postService.repost(postId, content);
      return { postId, ...data };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || 'Failed to repost');
      }
      return rejectWithValue('Failed to repost');
    }
  },
);
