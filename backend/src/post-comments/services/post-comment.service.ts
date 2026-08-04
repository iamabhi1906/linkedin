import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
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

    if (dto.parentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: dto.parentId, postId },
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = this.commentRepository.create({
      postId,
      authorId,
      parentId: dto.parentId,
      content: dto.content,
      mediaUrl: dto.mediaUrl,
    });
    const savedComment = await this.commentRepository.save(comment);

    post.commentsCount += 1;
    await this.postRepository.save(post);

    const fullComment = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: { author: true },
    });
    return fullComment || savedComment;
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

  async getComments(postId: string, userId?: string): Promise<any[]> {
    const comments = await this.commentRepository.find({
      where: { postId, parentId: IsNull() },
      relations: {
        author: true,
        likes: true,
        children: { author: true, likes: true },
      },
      order: { createdAt: 'ASC' },
    });

    const formatComment = (c: PostComment) => {
      const userLike = userId && c.likes ? c.likes.find((l) => l.userId === userId) : null;
      return {
        ...c,
        liked: !!userLike,
        selectedReaction: userLike?.reaction || 'like',
        userLike: userLike || null,
        children: c.children ? c.children.map(formatComment) : [],
      };
    };

    return comments.map(formatComment);
  }
}
