import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PostVisibility } from '../../enums/post-visibility.enum';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;
}
