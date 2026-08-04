import { Post } from '../entities/post.entity';
import { PostVisibility } from '../enums/post-visibility.enum';

export interface FeedPostResult {
  id: string;
  authorId: string;
  author: Post['author'];
  organizationId?: string;
  organization?: Post['organization'];
  content: string;
  visibility: PostVisibility;
  commentsCount: number;
  repostsCount: number;
  originalPostId?: string;
  originalPost?: Post;
  media: Post['media'];
  createdAt: Date;
  updatedAt: Date;
  isLiked: boolean;
  userReaction: string | null;
  likeReaction?: string | null;
  userLike?: any;
  reactionCounts: {
    reaction: string;
    count: number;
  }[];
  isReposted: boolean;
}
