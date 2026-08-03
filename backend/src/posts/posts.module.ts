import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { PostLike } from '../post-likes/entities/post-like.entity';
import { PostComment } from '../post-comments/entities/post-comment.entity';
import { CreatePostService } from './services/create-post.service';
import { GetPostService } from './services/get-post.service';
import { UpdatePostService } from './services/update-post.service';
import { DeletePostService } from './services/delete-post.service';
import { FeedService } from './services/feed.service';
import { PostController } from './controllers/post.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { TokenModule } from '../token/token.module';
import { PostMediaModule } from '../post-media/post-media.module';
import { PostLikesModule } from '../post-likes/post-likes.module';
import { PostCommentsModule } from '../post-comments/post-comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostMedia, PostLike, PostComment]),
    UploadsModule,
    TokenModule,
    PostMediaModule,
    PostLikesModule,
    PostCommentsModule,
  ],
  controllers: [PostController],
  providers: [
    CreatePostService,
    GetPostService,
    UpdatePostService,
    DeletePostService,
    FeedService,
  ],
  exports: [
    CreatePostService,
    GetPostService,
    FeedService,
  ],
})
export class PostsModule {}
