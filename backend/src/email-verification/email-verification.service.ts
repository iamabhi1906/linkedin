import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from './entities/email-verification.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { SendOtpDTO } from './dto/send-otp.dto';
import {
  MAX_ATTEMPTS,
  OTP_EXPIRY,
  RESEND_DELAY,
} from './email-verification.constants';
import { compareOtp, generateOtp, hashOtp } from './utils/otp.util';
import { VerifyOtpDTO } from './dto/verify-otp.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async sendVerificationOtp({ email }: SendOtpDTO): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }
    const existing = await this.emailVerificationRepository.findOne({
      where: { email },
      order: {
        createdAt: 'DESC',
      },
    });
    if (existing && Date.now() - existing.createdAt.getTime() < RESEND_DELAY) {
      throw new HttpException(
        'Too many OTP request',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    await this.emailVerificationRepository.delete({ email });
    const otp = generateOtp();
    const verification = this.emailVerificationRepository.create({
      email,
      otpHash: await hashOtp(otp),
      expiresAt: new Date(Date.now() + OTP_EXPIRY),
    });
    await this.emailVerificationRepository.save(verification);
    await this.mailService.sendVerificationOtp(email, otp);
  }

  async sendPasswordResetOtp({ email }: SendOtpDTO): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const existing = await this.emailVerificationRepository.findOne({
      where: { email },
      order: {
        createdAt: 'DESC',
      },
    });
    if (existing && Date.now() - existing.createdAt.getTime() < RESEND_DELAY) {
      throw new HttpException(
        'Too many OTP requests. Please wait before requesting another.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    await this.emailVerificationRepository.delete({ email });
    const otp = generateOtp();
    const verification = this.emailVerificationRepository.create({
      email,
      otpHash: await hashOtp(otp),
      expiresAt: new Date(Date.now() + OTP_EXPIRY),
    });
    await this.emailVerificationRepository.save(verification);
    await this.mailService.sendPasswordResetOtp(email, otp);
  }

  async verifyOtp({ email, otp }: VerifyOtpDTO): Promise<void> {
    const verification = await this.emailVerificationRepository.findOne({
      where: { email },
      order: { createdAt: 'DESC' },
    });
    if (!verification) {
      throw new NotFoundException('No verification OTP found');
    }
    if (verification.expiresAt.getTime() < Date.now()) {
      await this.emailVerificationRepository.delete({ id: verification.id });
      throw new BadRequestException('OTP expired');
    }
    if (verification.attempts >= MAX_ATTEMPTS) {
      await this.emailVerificationRepository.delete({
        id: verification.id,
      });
      throw new HttpException(
        'Too many invalid attempts. Please request a new OTP.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const isValid = await compareOtp(otp, verification.otpHash);
    if (!isValid) {
      verification.attempts++;
      await this.emailVerificationRepository.save(verification);
      throw new BadRequestException('Invalid OTP');
    }
    await this.usersService.verifyEmail(email);
    await this.emailVerificationRepository.delete({
      id: verification.id,
    });
  }

  async verifyPasswordResetOtp({ email, otp }: VerifyOtpDTO): Promise<void> {
    const verification = await this.emailVerificationRepository.findOne({
      where: { email },
      order: { createdAt: 'DESC' },
    });
    if (!verification) {
      throw new NotFoundException('No password reset OTP found');
    }
    if (verification.expiresAt.getTime() < Date.now()) {
      await this.emailVerificationRepository.delete({ id: verification.id });
      throw new BadRequestException('OTP expired');
    }
    if (verification.attempts >= MAX_ATTEMPTS) {
      await this.emailVerificationRepository.delete({
        id: verification.id,
      });
      throw new HttpException(
        'Too many invalid attempts. Please request a new OTP.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const isValid = await compareOtp(otp, verification.otpHash);
    if (!isValid) {
      verification.attempts++;
      await this.emailVerificationRepository.save(verification);
      throw new BadRequestException('Invalid OTP');
    }
    await this.emailVerificationRepository.delete({
      id: verification.id,
    });
  }

  async resendOtp(email: string): Promise<void> {
    await this.sendVerificationOtp({ email });
  }
}
