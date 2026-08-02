import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostVisibility } from '../enums/post-visibility.enum';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getFeed(
    page = 1,
    limit = 20,
  ): Promise<{ posts: Post[]; total: number }> {
    const skip = (page - 1) * limit;
    const [posts, total] = await this.postRepository.findAndCount({
      where: { visibility: PostVisibility.PUBLIC },
      relations: {
        author: true,
        organization: true,
        media: true,
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { posts, total };
  }
}
