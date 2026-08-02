import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostMedia } from './entities/post-media.entity';
import { PostLike } from './entities/post-like.entity';
import { PostComment } from './entities/post-comment.entity';
import { CreatePostService } from './services/create-post.service';
import { GetPostService } from './services/get-post.service';
import { UpdatePostService } from './services/update-post.service';
import { DeletePostService } from './services/delete-post.service';
import { FeedService } from './services/feed.service';
import { PostMediaService } from './services/post-media.service';
import { PostLikeService } from './services/post-like.service';
import { PostCommentService } from './services/post-comment.service';
import { PostController } from './controllers/post.controller';
import { PostLikeController } from './controllers/post-like.controller';
import { PostCommentController } from './controllers/post-comment.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostMedia, PostLike, PostComment]),
    UploadsModule,
    TokenModule,
  ],
  controllers: [PostController, PostLikeController, PostCommentController],
  providers: [
    CreatePostService,
    GetPostService,
    UpdatePostService,
    DeletePostService,
    FeedService,
    PostMediaService,
    PostLikeService,
    PostCommentService,
  ],
  exports: [
    CreatePostService,
    GetPostService,
    FeedService,
    PostLikeService,
    PostCommentService,
  ],
})
export class PostsModule {}
