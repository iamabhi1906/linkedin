import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostVisibility } from '../../enums/post-visibility.enum';

export class PostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  authorId: string;

  @ApiPropertyOptional()
  organizationId?: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: PostVisibility })
  visibility: PostVisibility;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  commentsCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
