import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post as HttpPost,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { OptionalJwtAuthGuard } from 'src/infra/guards/optional-jwt.guard';
import { PostCommentService } from '../services/post-comment.service';
import { LikeService } from '../../likes/services/like.service';
import { CreateCommentDto } from '../dto/request/create-comment.dto';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('posts/:postId/comments')
export class PostCommentController {
  constructor(
    private readonly commentService: PostCommentService,
    private readonly likeService: LikeService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getComments(
    @Param('postId') postId: string,
    @Req() req?: AuthenticatedRequest,
  ) {
    const comments = await this.commentService.getComments(postId, req?.user?.sub);
    return { status: 'success', comments };
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  async createComment(
    @Param('postId') postId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCommentDto,
  ) {
    const comment = await this.commentService.createComment(
      postId,
      req.user.sub,
      dto,
    );
    return {
      status: 'success',
      message: 'Comment added successfully',
      comment,
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost(':commentId/likes')
  async toggleCommentLike(
    @Param('commentId') commentId: string,
    @Req() req: AuthenticatedRequest,
    @Body('reaction') reaction?: string,
  ) {
    const result = await this.likeService.toggleCommentLike(
      commentId,
      req.user.sub,
      reaction,
    );
    return { status: 'success', ...result };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.commentService.deleteComment(postId, commentId, req.user.sub);
    return {
      status: 'success',
      message: 'Comment deleted successfully',
    };
  }
}
