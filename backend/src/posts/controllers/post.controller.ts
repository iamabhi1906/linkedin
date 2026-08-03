import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as HttpPost,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { OptionalJwtAuthGuard } from 'src/infra/guards/optional-jwt.guard';
import { CreatePostService } from '../services/create-post.service';
import { GetPostService } from '../services/get-post.service';
import { UpdatePostService } from '../services/update-post.service';
import { DeletePostService } from '../services/delete-post.service';
import { FeedService } from '../services/feed.service';
import { PostMediaService } from '../../post-media/services/post-media.service';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostService: CreatePostService,
    private readonly getPostService: GetPostService,
    private readonly updatePostService: UpdatePostService,
    private readonly deletePostService: DeletePostService,
    private readonly feedService: FeedService,
    private readonly mediaService: PostMediaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePostDto) {
    const post = await this.createPostService.execute(req.user.sub, dto);
    return { status: 'success', message: 'Post created successfully', post };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('feed')
  async getFeed(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user?.sub;
    const result = await this.feedService.getFeed(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      userId,
    );
    return { status: 'success', ...result };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async findById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user?.sub;
    const post = await this.getPostService.findById(id, userId);
    return { status: 'success', post };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePostDto,
  ) {
    const post = await this.updatePostService.execute(id, req.user.sub, dto);
    return { status: 'success', message: 'Post updated successfully', post };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.deletePostService.execute(id, req.user.sub);
    return { status: 'success', message: 'Post deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpPost(':id/media')
  async uploadMedia(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const media = await this.mediaService.attachMedia(id, req.user.sub, file);
    return {
      status: 'success',
      message: 'Media attached successfully',
      media,
    };
  }
}
