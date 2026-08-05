import { Injectable } from '@nestjs/common';
import { LikeService } from '../../likes/services/like.service';

@Injectable()
export class PostLikeService {
  constructor(private readonly likeService: LikeService) {}

  async toggleLike(postId: string, userId: string, reaction = 'like') {
    return this.likeService.togglePostLike(postId, userId, reaction);
  }

  async toggleCommentLike(
    commentId: string,
    userId: string,
    reaction = 'like',
  ) {
    return this.likeService.toggleCommentLike(commentId, userId, reaction);
  }

  async getLikes(postId: string) {
    return this.likeService.getPostLikes(postId);
  }

  async getCommentLikes(commentId: string) {
    return this.likeService.getCommentLikes(commentId);
  }
}
