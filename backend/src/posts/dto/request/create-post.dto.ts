import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PostVisibility } from '../../enums/post-visibility.enum';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Post content cannot be empty' })
  content!: string;

  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;
}
