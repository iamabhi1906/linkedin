import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(150, { message: 'Name must not exceed 150 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(50, { message: 'Username must not exceed 50 characters' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Headline must be a string' })
  @MaxLength(220, { message: 'Headline must not exceed 220 characters' })
  headline?: string;

  @IsOptional()
  @IsString({ message: 'About must be a string' })
  about?: string;

  @IsOptional()
  @IsString({ message: 'Website must be a valid string' })
  website?: string;

  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  @MaxLength(150, { message: 'Location must not exceed 150 characters' })
  location?: string;

  @IsOptional()
  @IsString({ message: 'Profile picture must be a string' })
  profilePicture?: string;

  @IsOptional()
  @IsString({ message: 'Cover picture must be a string' })
  coverPicture?: string;

  @IsOptional()
  isPrivate?: boolean;

}
