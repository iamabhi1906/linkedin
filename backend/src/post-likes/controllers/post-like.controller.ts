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
import { PostLikeService } from '../services/post-like.service';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('posts/:postId/likes')
export class PostLikeController {
  constructor(private readonly likeService: PostLikeService) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  async toggleLike(
    @Param('postId') postId: string,
    @Req() req: AuthenticatedRequest,
    @Body('reaction') reaction?: string,
  ) {
    const result = await this.likeService.toggleLike(
      postId,
      req.user.sub,
      reaction,
    );
    return { status: 'success', ...result };
  }

  @Get()
  async getLikes(@Param('postId') postId: string) {
    const likes = await this.likeService.getLikes(postId);
    return { status: 'success', likes };
  }
}
