import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class GetPostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findById(
    id: string,
    userId?: string,
  ): Promise<Omit<Post, 'likes'> & { isLiked: boolean }> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: {
        author: true,
        organization: true,
        media: true,
        likes: true,
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID '${id}' not found`);
    }
    const isLiked = userId
      ? post.likes?.some((like) => like.userId === userId) || false
      : false;
    return { ...post, isLiked };
  }

  async findByAuthor(
    authorId: string,
    currentUserId?: string,
  ): Promise<(Omit<Post, 'likes'> & { isLiked: boolean })[]> {
    const posts = await this.postRepository.find({
      where: { authorId },
      relations: { author: true, organization: true, media: true, likes: true },
      order: { createdAt: 'DESC' },
    });
    return posts.map((post) => {
      const isLiked = currentUserId
        ? post.likes?.some((like) => like.userId === currentUserId) || false
        : false;
      return { ...post, isLiked };
    });
  }

  async findByOrganization(
    organizationId: string,
    currentUserId?: string,
  ): Promise<(Omit<Post, 'likes'> & { isLiked: boolean })[]> {
    const posts = await this.postRepository.find({
      where: { organizationId },
      relations: { author: true, organization: true, media: true, likes: true },
      order: { createdAt: 'DESC' },
    });
    return posts.map((post) => {
      const isLiked = currentUserId
        ? post.likes?.some((like) => like.userId === currentUserId) || false
        : false;
      return { ...post, isLiked };
    });
  }
}
