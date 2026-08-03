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
import { PostCommentService } from '../services/post-comment.service';
import { CreateCommentDto } from '../dto/request/create-comment.dto';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('posts/:postId/comments')
export class PostCommentController {
  constructor(private readonly commentService: PostCommentService) {}

  @Get()
  async getComments(@Param('postId') postId: string) {
    const comments = await this.commentService.getComments(postId);
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
