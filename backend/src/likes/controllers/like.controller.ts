import {
  Body,
  Controller,
  Get,
  Param,
  Post as HttpPost,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { LikeService } from '../services/like.service';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { ToggleLikeDto } from '../dto/toggle-like.dto';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost('posts/:postId/likes')
  async togglePostLike(
    @Param('postId') postId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: ToggleLikeDto,
  ) {
    const result = await this.likeService.togglePostLike(postId, req.user.sub, dto.reaction);
    return { status: 'success', ...result };
  }

  @Get('posts/:postId/likes')
  async getPostLikes(@Param('postId') postId: string) {
    const likes = await this.likeService.getPostLikes(postId);
    return { status: 'success', likes };
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost('comments/:commentId/likes')
  async toggleCommentLike(
    @Param('commentId') commentId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: ToggleLikeDto,
  ) {
    const result = await this.likeService.toggleCommentLike(commentId, req.user.sub, dto.reaction);
    return { status: 'success', ...result };
  }

  @Get('comments/:commentId/likes')
  async getCommentLikes(@Param('commentId') commentId: string) {
    const likes = await this.likeService.getCommentLikes(commentId);
    return { status: 'success', likes };
  }
}
