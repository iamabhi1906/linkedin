
import { User } from '../user/user.type';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  parentId: string | null;
  children: Comment[];
  content: string;
  mediaUrl?: string | null;
  likesCount: number;
  liked?: boolean;
  selectedReaction?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AddCommentPayload {
  postId: string;
  content: string;
  parentId?: string;
  mediaUrl?: string;
}

export interface ToggleCommentLikePayload {
  postId: string;
  commentId: string;
  reaction?: string;
}
