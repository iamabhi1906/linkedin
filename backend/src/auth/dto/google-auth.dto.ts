import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class GoogleAuthDTO {
  @ApiProperty({
    description: 'Google OAuth user ID',
    example: '10928374659281726',
  })
  @IsString({ message: 'Google ID must be a string' })
  @IsNotEmpty({ message: 'Google ID is required' })
  googleId!: string;

  @ApiProperty({
    description: 'Google account email',
    example: 'john@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ description: 'Google account name', example: 'John Doe' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(150, { message: 'Name must not exceed 150 characters' })
  name!: string;

  @ApiPropertyOptional({
    description: 'URL of the profile picture from Google',
    example: 'https://lh3.googleusercontent.com/a/default-user',
  })
  @IsOptional()
  @IsString({ message: 'Profile picture must be a string' })
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'Custom username if provided',
    example: 'johndoe',
  })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(50, { message: 'Username must not exceed 50 characters' })
  username?: string;
}
