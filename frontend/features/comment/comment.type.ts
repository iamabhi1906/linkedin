import { User } from '../user/user.type';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  parentId: string | null;
  children: Comment[];
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
