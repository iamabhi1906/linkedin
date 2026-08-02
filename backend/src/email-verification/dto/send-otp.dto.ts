import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendOtpDTO {
  @ApiProperty({
    description: 'Email address to send OTP to',
    example: 'john@example.com',
  })
  @IsEmail()
  email!: string;
}
