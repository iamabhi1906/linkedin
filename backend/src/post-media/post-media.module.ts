import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMedia } from './entities/post-media.entity';
import { Post } from '../posts/entities/post.entity';
import { PostMediaService } from './services/post-media.service';
import { UploadsModule } from '../uploads/uploads.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostMedia, Post]),
    UploadsModule,
    TokenModule,
  ],
  providers: [PostMediaService],
  exports: [PostMediaService],
})
export class PostMediaModule {}
