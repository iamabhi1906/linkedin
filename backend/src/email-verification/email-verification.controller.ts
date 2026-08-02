import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { VerifyOtpDTO } from './dto/verify-otp.dto';
import { SendOtpDTO } from './dto/send-otp.dto';

@Controller('verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('verify-otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyOtp(@Body() body: VerifyOtpDTO): Promise<void> {
    await this.emailVerificationService.verifyOtp(body);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendOtp(@Body() body: SendOtpDTO): Promise<void> {
    await this.emailVerificationService.resendOtp(body.email);
  }
}
