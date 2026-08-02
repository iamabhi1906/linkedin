import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PostVisibility } from '../../enums/post-visibility.enum';

export class UpdatePostDto {
  @ApiPropertyOptional({ description: 'Updated text content of the post' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ enum: PostVisibility })
  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;
}
