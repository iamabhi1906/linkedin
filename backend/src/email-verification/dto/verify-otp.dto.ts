import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class VerifyOtpDTO {
  @ApiProperty({
    description: 'Email address to verify',
    example: 'john@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
  })
  @Length(6, 6)
  otp!: string;
}
