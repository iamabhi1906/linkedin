import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { PostVisibility } from '../enums/post-visibility.enum';

@Injectable()
export class CreatePostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(authorId: string, dto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create({
      authorId,
      content: dto.content,
      organizationId: dto.organizationId,
      visibility: dto.visibility ?? PostVisibility.PUBLIC,
      likesCount: 0,
      commentsCount: 0,
    });
    return await this.postRepository.save(post);
  }
}
