import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { RepostDto } from '../dto/request/repost.dto';
import { PostVisibility } from '../enums/post-visibility.enum';

@Injectable()
export class RepostPostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(
    postId: string,
    userId: string,
    dto?: RepostDto,
  ): Promise<{ message: string; post?: Post; isReposted: boolean }> {
    const targetPost = await this.postRepository.findOne({
      where: { id: postId },
      relations: { author: true, media: true, organization: true },
    });
    if (!targetPost) {
      throw new NotFoundException(`Post with ID '${postId}' not found`);
    }
    const rootPostId = targetPost.originalPostId || targetPost.id;
    const rootPost =
      rootPostId === targetPost.id
        ? targetPost
        : await this.postRepository.findOne({ where: { id: rootPostId } });

    if (!rootPost) {
      throw new NotFoundException('Original post not found');
    }

    const hasThought = Boolean(dto?.content && dto.content.trim().length > 0);

    const existingRepost = await this.postRepository.findOne({
      where: {
        authorId: userId,
        originalPostId: rootPostId,
        content: '',
      },
    });

    if (existingRepost && !hasThought) {
      await this.postRepository.remove(existingRepost);
      rootPost.repostsCount = Math.max(0, rootPost.repostsCount - 1);
      await this.postRepository.save(rootPost);

      return {
        message: 'Repost removed successfully',
        isReposted: false,
      };
    }

    const newRepost = this.postRepository.create({
      authorId: userId,
      originalPostId: rootPostId,
      content: dto?.content?.trim() || '',
      visibility: PostVisibility.PUBLIC,
    });

    const savedRepost = await this.postRepository.save(newRepost);

    rootPost.repostsCount = (rootPost.repostsCount || 0) + 1;
    await this.postRepository.save(rootPost);

    const fullRepost = await this.postRepository.findOne({
      where: { id: savedRepost.id },
      relations: {
        author: true,
        originalPost: {
          author: true,
          media: true,
          organization: true,
        },
      },
    });

    return {
      message: hasThought
        ? 'Reposted with thoughts successfully'
        : 'Reposted successfully',
      post: fullRepost || savedRepost,
      isReposted: true,
    };
  }
}
