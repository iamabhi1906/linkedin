import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { PostLike } from '../entities/post-like.entity';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly likeRepository: Repository<PostLike>,
  ) {}

  async toggleLike(
    postId: string,
    userId: string,
  ): Promise<{ liked: boolean; likesCount: number }> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      post.likesCount = Math.max(0, post.likesCount - 1);
      await this.postRepository.save(post);
      return { liked: false, likesCount: post.likesCount };
    } else {
      const like = this.likeRepository.create({ postId, userId });
      await this.likeRepository.save(like);
      post.likesCount += 1;
      await this.postRepository.save(post);
      return { liked: true, likesCount: post.likesCount };
    }
  }

  async getLikes(postId: string): Promise<PostLike[]> {
    return await this.likeRepository.find({
      where: { postId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }
}
