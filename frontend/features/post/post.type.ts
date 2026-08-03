import { User } from '../user/user.type';

export interface Post {
  id: string;
  authorId: string;
  author: User;
  organizationId: string | null;
  organization: {
    id?: string;
    name?: string;
    logo?: string;
  } | null;
  content: string;
  visibility: 'PUBLIC' | 'CONNECTIONS' | 'ONLY_ME';
  likesCount: number;
  commentsCount: number;
  repostsCount?: number;
  isLiked?: boolean;
  isReposted?: boolean;
  originalPostId?: string | null;
  originalPost?: Post | null;
  media: { url?: string; fileUrl?: string; mediaType?: string }[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreatePostPayload {
  content: string;
  organizationId?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS' | 'ONLY_ME';
}
