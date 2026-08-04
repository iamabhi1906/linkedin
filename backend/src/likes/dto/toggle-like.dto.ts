import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LikeTargetType } from '../entities/like.entity';

export class ToggleLikeDto {
  @IsOptional()
  @IsString()
  reaction?: string;

  @IsOptional()
  @IsEnum(LikeTargetType)
  targetType?: LikeTargetType;
}
