import {
  Controller,
  Get,
  Param,
  Post as HttpPost,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { PostLikeService } from '../services/post-like.service';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@ApiTags('Post Likes')
@Controller('posts/:postId/likes')
export class PostLikeController {
  constructor(private readonly likeService: PostLikeService) {}

  @ApiOperation({ summary: 'Toggle like / unlike on a post' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpPost()
  async toggleLike(
    @Param('postId') postId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const result = await this.likeService.toggleLike(postId, req.user.sub);
    return { status: 'success', ...result };
  }

  @ApiOperation({ summary: 'List likes for a post' })
  @Get()
  async getLikes(@Param('postId') postId: string) {
    const likes = await this.likeService.getLikes(postId);
    return { status: 'success', likes };
  }
}
