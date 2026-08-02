import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PostVisibility } from '../../enums/post-visibility.enum';

export class CreatePostDto {
  @ApiProperty({
    description: 'Text content of the post',
    example: 'Excited to announce my new role!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Post content cannot be empty' })
  content!: string;

  @ApiPropertyOptional({
    description: 'Organization ID if posting on behalf of an organization page',
  })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiPropertyOptional({
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
  })
  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;
}
