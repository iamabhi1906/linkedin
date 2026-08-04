import { Module } from '@nestjs/common';
import { PostLikeService } from './services/post-like.service';
import { PostLikeController } from './controllers/post-like.controller';
import { TokenModule } from '../token/token.module';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [TokenModule, LikesModule],
  controllers: [PostLikeController],
  providers: [PostLikeService],
  exports: [PostLikeService],
})
export class PostLikesModule {}
