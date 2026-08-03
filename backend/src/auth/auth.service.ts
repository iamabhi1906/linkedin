import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { GoogleAuthDTO } from './dto/google-auth.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { User } from '../users/entities/user.entity';
import { AuthProvider } from '../users/enums/auth-provider.enum';
import { UserStatus } from '../users/enums/user-status.enum';
import { TokenService } from '../token/token.service';
import { PasswordService } from '../password/password.service';
import { EmailVerificationService } from '../email-verification/email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async signup(signupDto: SignupDTO): Promise<User> {
    const existingUser = await this.usersService.findByEmail(signupDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    let username: string;
    if (signupDto.username) {
      const existingUsername = await this.usersService.findByUsername(
        signupDto.username,
      );
      if (existingUsername) {
        throw new ConflictException('Username is already taken');
      }
      username = signupDto.username;
    } else {
      username = await this.usersService.generateUniqueUsername(
        signupDto.name || signupDto.email,
      );
    }

    const hashedPassword = await this.passwordService.hash(signupDto.password);
    const user = await this.usersService.create({
      name: signupDto.name,
      username,
      email: signupDto.email.toLowerCase(),
      password: hashedPassword,
      authProvider: AuthProvider.EMAIL,
      isVerified: true,
    });

    await this.emailVerificationService.sendVerificationOtp({
      email: user.email,
    });

    delete user.password;
    return user;
  }

  async login(loginDto: LoginDTO) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('Your account has been suspended');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Account registered with Google. Please log in using Google authentication.',
      );
    }

    const isPasswordValid = await this.passwordService.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new ForbiddenException(
        'Email not verified. Please verify your email before logging in.',
      );
    }

    await this.usersService.updateLastLogin(user.id);

    const tokens = await this.tokenService.generateTokenPair({
      sub: String(user.id),
      email: user.email,
    });

    delete user.password;
    return {
      user,
      tokens,
    };
  }

  async googleAuth(googleAuthDto: GoogleAuthDTO) {
    let user = await this.usersService.findByGoogleId(googleAuthDto.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(googleAuthDto.email);
    }

    if (user) {
      if (user.status === UserStatus.SUSPENDED) {
        throw new ForbiddenException('Your account has been suspended');
      }

      if (!user.googleId) {
        user.googleId = googleAuthDto.googleId;
      }
      if (!user.profilePicture && googleAuthDto.profilePicture) {
        user.profilePicture = googleAuthDto.profilePicture;
      }
      user.isVerified = true;
      user = await this.usersService.save(user);
    } else {
      const username =
        googleAuthDto.username ||
        (await this.usersService.generateUniqueUsername(
          googleAuthDto.name || googleAuthDto.email,
        ));

      user = await this.usersService.create({
        name: googleAuthDto.name,
        username,
        email: googleAuthDto.email.toLowerCase(),
        authProvider: AuthProvider.GOOGLE,
        googleId: googleAuthDto.googleId,
        profilePicture: googleAuthDto.profilePicture,
        isVerified: true,
        status: UserStatus.ACTIVE,
      });
    }

    await this.usersService.updateLastLogin(user.id);

    const tokens = await this.tokenService.generateTokenPair({
      sub: String(user.id),
      email: user.email,
    });

    delete user.password;
    return {
      user,
      tokens,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findById(payload.sub);
    if (!user || user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('User account invalid or suspended');
    }
    const tokens = await this.tokenService.generateTokenPair({
      sub: String(user.id),
      email: user.email,
    });
    return tokens;
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return;
    }
    await this.emailVerificationService.sendPasswordResetOtp({
      email: dto.email,
    });
  }

  async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    await this.emailVerificationService.verifyPasswordResetOtp({
      email: dto.email,
      otp: dto.otp,
    });

    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.password = await this.passwordService.hash(dto.newPassword);
    await this.usersService.save(user);
  }

  async verifyOtp(verifyOtpDto: { email: string; otp: string }): Promise<void> {
    await this.emailVerificationService.verifyOtp(verifyOtpDto);
  }

  async resendOtp(email: string): Promise<void> {
    await this.emailVerificationService.resendOtp(email);
  }
}
