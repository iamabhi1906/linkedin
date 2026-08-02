import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostComment } from '../entities/post-comment.entity';
import { CreateCommentDto } from '../dto/request/create-comment.dto';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostComment)
    private readonly commentRepository: Repository<PostComment>,
  ) {}

  async createComment(
    postId: string,
    authorId: string,
    dto: CreateCommentDto,
  ): Promise<PostComment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentRepository.create({
      postId,
      authorId,
      content: dto.content,
    });
    const savedComment = await this.commentRepository.save(comment);

    post.commentsCount += 1;
    await this.postRepository.save(post);

    return savedComment;
  }

  async deleteComment(
    postId: string,
    commentId: string,
    userId: string,
  ): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, postId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (comment.authorId !== userId && post?.authorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    await this.commentRepository.softDelete(commentId);

    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await this.postRepository.save(post);
    }
  }

  async getComments(postId: string): Promise<PostComment[]> {
    return await this.commentRepository.find({
      where: { postId },
      relations: { author: true },
      order: { createdAt: 'ASC' },
    });
  }
}
