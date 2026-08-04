import { createSlice } from '@reduxjs/toolkit';
import { Comment } from './comment.type';
import { fetchCommentsThunk, addCommentThunk, toggleCommentLikeThunk } from './comment.action';
import { RootState } from '@/app/store';

interface CommentState {
  commentsByPostId: Record<string, Comment[]>;
  loadingByPostId: Record<string, boolean>;
  error: string | null;
}

const initialState: CommentState = {
  commentsByPostId: {},
  loadingByPostId: {},
  error: null,
};

const updateCommentLike = (comments: Comment[], commentId: string, liked: boolean, likesCount: number, reaction?: string): boolean => {
  for (const c of comments) {
    if (c.id === commentId) {
      c.liked = liked;
      c.likesCount = likesCount;
      c.selectedReaction = reaction;
      return true;
    }
    if (c.children && c.children.length > 0) {
      const found = updateCommentLike(c.children, commentId, liked, likesCount, reaction);
      if (found) return true;
    }
  }
  return false;
};

const insertReply = (comments: Comment[], parentId: string, newReply: Comment): boolean => {
  for (const c of comments) {
    if (c.id === parentId) {
      if (!c.children) c.children = [];
      c.children.push(newReply);
      return true;
    }
    if (c.children && c.children.length > 0) {
      const found = insertReply(c.children, parentId, newReply);
      if (found) return true;
    }
  }
  return false;
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsThunk.pending, (state, action) => {
        state.loadingByPostId[action.meta.arg] = true;
      })
      .addCase(fetchCommentsThunk.fulfilled, (state, action) => {
        state.loadingByPostId[action.payload.postId] = false;
        state.commentsByPostId[action.payload.postId] = action.payload.comments;
      })
      .addCase(fetchCommentsThunk.rejected, (state, action) => {
        const postId = action.meta.arg;
        state.loadingByPostId[postId] = false;
        state.error = action.payload as string;
      })
      .addCase(addCommentThunk.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = [];
        }
        if (comment.parentId) {
          insertReply(state.commentsByPostId[postId], comment.parentId, comment);
        } else {
          state.commentsByPostId[postId].unshift(comment);
        }
      })
      .addCase(toggleCommentLikeThunk.fulfilled, (state, action) => {
        const { postId, commentId, liked, likesCount, reaction } = action.payload;
        const list = state.commentsByPostId[postId];
        if (list) {
          updateCommentLike(list, commentId, liked, likesCount, reaction);
        }
      });
  },
});

export const selectCommentsForPost = (state: RootState, postId: string) =>
  state.comment.commentsByPostId[postId] || [];

export const selectCommentsLoading = (state: RootState, postId: string) =>
  !!state.comment.loadingByPostId[postId];

export default commentSlice.reducer;
