import { PostVisibility } from '../../enums/post-visibility.enum';

export class PostResponseDto {
  id!: string;

  authorId!: string;

  organizationId?: string;

  content!: string;

  visibility!: PostVisibility;

  likesCount!: number;

  commentsCount!: number;

  createdAt!: Date;

  updatedAt!: Date;
}
