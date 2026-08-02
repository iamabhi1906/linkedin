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

  async findById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: {
        author: true,
        organization: true,
        media: true,
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID '${id}' not found`);
    }
    return post;
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return await this.postRepository.find({
      where: { authorId },
      relations: { author: true, media: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByOrganization(organizationId: string): Promise<Post[]> {
    return await this.postRepository.find({
      where: { organizationId },
      relations: { author: true, organization: true, media: true },
      order: { createdAt: 'DESC' },
    });
  }
}
