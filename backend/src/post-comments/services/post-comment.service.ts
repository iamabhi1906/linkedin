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

  async getComments(postId: string, userId?: string): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { postId },
      relations: {
        author: true,
        likes: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    const map = new Map<string, any>();

    comments.forEach((comment) => {
      const userLike =
        userId && comment.likes
          ? comment.likes.find((l) => l.userId === userId)
          : null;

      map.set(comment.id, {
        ...comment,
        liked: !!userLike,
        selectedReaction: userLike?.reaction || 'like',
        userLike: userLike || null,
        children: [],
      });
    });

    const roots: Comment[] = [];

    comments.forEach((comment) => {
      const node: Comment = map.get(comment.id);
      if (comment.parentId) {
        map.get(comment.parentId)?.children.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }

  async getCommentById(commentId: string): Promise<PostComment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment)
      throw new NotFoundException(`Comment with Id:${commentId} not found..!!`);

    return comment;
  }
}
