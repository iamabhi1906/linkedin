import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostMedia } from '../entities/post-media.entity';
import { UploadsService } from '../../uploads/uploads.service';
import { UploadFolder } from '../../uploads/enums/upload-folder.enum';
import { MediaType } from '../enums/media-type.enum';

@Injectable()
export class PostMediaService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostMedia)
    private readonly mediaRepository: Repository<PostMedia>,
    private readonly uploadsService: UploadsService,
  ) {}

  async attachMedia(
    postId: string,
    authorId: string,
    file: Express.Multer.File,
    mediaType = MediaType.IMAGE,
  ): Promise<PostMedia> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenException(
        'You do not have permission to attach media to this post',
      );
    }

    const filePath = await this.uploadsService.uploadSingle(
      file,
      UploadFolder.POST_MEDIA,
    );

    const media = this.mediaRepository.create({
      postId,
      url: filePath,
      mediaType,
    });

    return await this.mediaRepository.save(media);
  }
}
