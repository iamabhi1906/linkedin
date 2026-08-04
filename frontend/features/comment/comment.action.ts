import { createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '@/services/posts/post.service';
import { AddCommentPayload, ToggleCommentLikePayload } from './comment.type';

export const fetchCommentsThunk = createAsyncThunk(
  'comment/fetchComments',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await postService.getComments(postId);
      return { postId, comments: response.comments || [] };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch comments');
    }
  },
);

export const addCommentThunk = createAsyncThunk(
  'comment/addComment',
  async (payload: AddCommentPayload, { rejectWithValue }) => {
    try {
      const response = await postService.addComment(
        payload.postId,
        payload.content,
        payload.parentId,
        payload.mediaUrl,
      );
      return { postId: payload.postId, comment: response.comment };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to add comment');
    }
  },
);

export const toggleCommentLikeThunk = createAsyncThunk(
  'comment/toggleLike',
  async (payload: ToggleCommentLikePayload, { rejectWithValue }) => {
    try {
      const response = await postService.toggleCommentLike(
        payload.postId,
        payload.commentId,
        payload.reaction,
      );
      return {
        postId: payload.postId,
        commentId: payload.commentId,
        liked: response.liked,
        likesCount: response.likesCount,
        reaction: response.reaction,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to toggle like');
    }
  },
);
