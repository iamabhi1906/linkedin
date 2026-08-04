import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Post } from '../posts/entities/post.entity';
import { PostComment } from '../post-comments/entities/post-comment.entity';
import { LikeService } from './services/like.service';
import { LikeController } from './controllers/like.controller';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Post, PostComment]),
    TokenModule,
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikesModule {}
