import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { PostComment } from '../../post-comments/entities/post-comment.entity';
import { Like, LikeTargetType } from '../entities/like.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostComment)
    private readonly commentRepository: Repository<PostComment>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async togglePostLike(postId: string, userId: string, reaction = 'like') {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID '${postId}' not found`);
    }
    const existingLike = await this.findExistingLike(post, userId);
    if (!existingLike) {
      return this.likePost(post, userId, reaction);
    }
    if (existingLike.reaction !== reaction) {
      return this.updateReaction(existingLike, reaction);
    }
    return this.unlikePost(post, existingLike);
  }

  async toggleCommentLike(
    commentId: string,
    userId: string,
    reaction = 'like',
  ): Promise<{ liked: boolean; likesCount: number; reaction?: string }> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID '${commentId}' not found`);
    }
    const existingLike = await this.findExistingLike(comment, userId);

    if (existingLike) {
      if (reaction && existingLike.reaction !== reaction) {
        existingLike.reaction = reaction;
        await this.likeRepository.save(existingLike);
        return {
          liked: true,
          likesCount: comment.likesCount,
          reaction: existingLike.reaction,
        };
      } else {
        await this.likeRepository.remove(existingLike);
        comment.likesCount = Math.max(0, comment.likesCount - 1);
        await this.commentRepository.save(comment);
        return {
          liked: false,
          likesCount: comment.likesCount,
          reaction: undefined,
        };
      }
    } else {
      const like = this.likeRepository.create({
        commentId,
        userId,
        targetType: LikeTargetType.COMMENT,
        reaction,
      });
      await this.likeRepository.save(like);
      comment.likesCount += 1;
      await this.commentRepository.save(comment);
      return {
        liked: true,
        likesCount: comment.likesCount,
        reaction: like.reaction,
      };
    }
  }

  async getPostLikes(postId: string): Promise<Like[]> {
    return await this.likeRepository.find({
      where: { postId, targetType: LikeTargetType.POST },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getCommentLikes(commentId: string): Promise<Like[]> {
    return await this.likeRepository.find({
      where: { commentId, targetType: LikeTargetType.COMMENT },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  @Transactional()
  private async likePost(post: Post, userId: string, reaction: string) {
    const like = this.likeRepository.create({
      postId: post.id,
      userId,
      targetType: LikeTargetType.POST,
      reaction,
    });
    await this.likeRepository.save(like);
    post.likesCount++;
    await this.postRepository.save(post);
    return {
      liked: true,
      likesCount: post.likesCount,
      reaction,
    };
  }

  private async updateReaction(like: Like, reaction: string) {
    like.reaction = reaction;
    await this.likeRepository.save(like);
    return like;
  }

  @Transactional()
  private async unlikePost(post: Post, like: Like) {
    await this.likeRepository.remove(like);
    post.likesCount = Math.max(0, post.likesCount - 1);
    await this.postRepository.save(post);
    return {
      liked: false,
      likesCount: post.likesCount,
    };
  }

  private async findExistingLike(where: Partial<Like>, userId: string) {
    return await this.likeRepository.findOne({
      where: {
        ...where,
        userId,
      },
    });
  }
}
