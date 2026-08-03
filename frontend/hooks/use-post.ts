import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchFeedThunk, createPostThunk, toggleLikeThunk, repostThunk } from '@/features/post/post.action';
import { CreatePostPayload } from '@/services/posts/post.service';

export function usePost() {
  const dispatch = useDispatch<AppDispatch>();
  const postState = useSelector((state: RootState) => state.post);

  const fetchFeed = (page?: number, limit?: number) => dispatch(fetchFeedThunk({ page, limit }));
  const createPost = (payload: CreatePostPayload) => dispatch(createPostThunk(payload));
  const toggleLike = (postId: string) => dispatch(toggleLikeThunk(postId));
  const repost = (postId: string, content?: string) => dispatch(repostThunk({ postId, content }));

  return {
    ...postState,
    fetchFeed,
    createPost,
    toggleLike,
    repost,
  };
}
