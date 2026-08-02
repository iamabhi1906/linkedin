import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchFeedThunk, createPostThunk, toggleLikeThunk } from '@/features/post/post.slice';
import { CreatePostPayload } from '@/services/posts/post.service';

export function usePost() {
  const dispatch = useDispatch<AppDispatch>();
  const postState = useSelector((state: RootState) => state.post);

  const fetchFeed = (page?: number, limit?: number) => dispatch(fetchFeedThunk({ page, limit }));
  const createPost = (payload: CreatePostPayload) => dispatch(createPostThunk(payload));
  const toggleLike = (postId: string) => dispatch(toggleLikeThunk(postId));

  return {
    ...postState,
    fetchFeed,
    createPost,
    toggleLike,
  };
}
