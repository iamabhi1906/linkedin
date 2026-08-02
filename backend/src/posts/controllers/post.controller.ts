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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { CreatePostService } from '../services/create-post.service';
import { GetPostService } from '../services/get-post.service';
import { UpdatePostService } from '../services/update-post.service';
import { DeletePostService } from '../services/delete-post.service';
import { FeedService } from '../services/feed.service';
import { PostMediaService } from '../services/post-media.service';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@ApiTags('Posts')
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

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpPost()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePostDto) {
    const post = await this.createPostService.execute(req.user.sub, dto);
    return { status: 'success', message: 'Post created successfully', post };
  }

  @ApiOperation({ summary: 'Get public feed posts' })
  @Get('feed')
  async getFeed(@Query('page') page?: number, @Query('limit') limit?: number) {
    const result = await this.feedService.getFeed(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return { status: 'success', ...result };
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    const post = await this.getPostService.findById(id);
    return { status: 'success', post };
  }

  @ApiOperation({ summary: 'Update post content' })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Delete post' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.deletePostService.execute(id, req.user.sub);
    return { status: 'success', message: 'Post deleted successfully' };
  }

  @ApiOperation({ summary: 'Attach media to post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiBearerAuth()
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
