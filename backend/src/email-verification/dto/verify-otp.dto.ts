import { IsEmail, Length } from 'class-validator';

export class VerifyOtpDTO {
  @IsEmail()
  email!: string;

  @Length(6, 6)
  otp!: string;
}
