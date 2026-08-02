import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Full name', example: 'John Doe' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(150, { message: 'Name must not exceed 150 characters' })
  name?: string;

  @ApiPropertyOptional({ description: 'Unique username', example: 'johndoe' })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(50, { message: 'Username must not exceed 50 characters' })
  username?: string;

  @ApiPropertyOptional({
    description: 'Professional headline',
    example: 'Software Engineer at Google',
  })
  @IsOptional()
  @IsString({ message: 'Headline must be a string' })
  @MaxLength(220, { message: 'Headline must not exceed 220 characters' })
  headline?: string;

  @ApiPropertyOptional({
    description: 'Detailed about / bio section',
    example: 'Passionate software engineer building scalable web apps.',
  })
  @IsOptional()
  @IsString({ message: 'About must be a string' })
  about?: string;

  @ApiPropertyOptional({
    description: 'Personal or company website URL',
    example: 'https://johndoe.com',
  })
  @IsOptional()
  @IsString({ message: 'Website must be a valid string' })
  website?: string;

  @ApiPropertyOptional({
    description: 'Location',
    example: 'San Francisco, CA',
  })
  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  @MaxLength(150, { message: 'Location must not exceed 150 characters' })
  location?: string;

  @ApiPropertyOptional({
    description: 'Profile picture path',
    example: '/public/uploads/users/abc.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Profile picture must be a string' })
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'Cover picture path',
    example: '/public/uploads/users/def.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Cover picture must be a string' })
  coverPicture?: string;
}
