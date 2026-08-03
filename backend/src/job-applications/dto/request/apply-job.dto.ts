import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ApplyJobDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(150)
  name!: string;

  @IsEmail({}, { message: 'Valid email address is required' })
  @IsNotEmpty({ message: 'Email address is required' })
  @MaxLength(150)
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @MaxLength(30)
  phone!: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;
}
