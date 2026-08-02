import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { CookieService } from './cookie.service';
import { EmailVerificationModule } from '../email-verification/email-verification.module';
import { TokenModule } from 'src/token/token.module';
import { PasswordModule } from 'src/password/password.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    UsersModule,
    PasswordModule,
    EmailVerificationModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, CookieService],
  exports: [JwtModule],
})
export class AuthModule {}
