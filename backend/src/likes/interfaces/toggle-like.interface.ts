import { PostComment } from 'src/post-comments/entities/post-comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';
import { LikeTargetType } from '../entities/like.entity';

export default interface ToggleLikeOptions<T extends Post | PostComment> {
  entity: T;
  repository: Repository<T>;
  userId: string;
  reaction: string;
  targetType: LikeTargetType;
  likeData: Partial<{
    postId: string;
    commentId: string;
  }>;
}
