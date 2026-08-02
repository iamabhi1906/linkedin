import { Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerification } from './entities/email-verification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { EmailVerificationController } from './email-verification.controller';

@Module({
  imports: [
    MailModule,
    UsersModule,
    TypeOrmModule.forFeature([EmailVerification]),
  ],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
  controllers: [EmailVerificationController],
})
export class EmailVerificationModule {}
