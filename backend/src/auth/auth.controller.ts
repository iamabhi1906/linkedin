import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { GoogleAuthDTO } from './dto/google-auth.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { VerifyOtpDTO } from '../email-verification/dto/verify-otp.dto';
import { SendOtpDTO } from '../email-verification/dto/send-otp.dto';
import { type Response, type Request } from 'express';
import { type AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { CookieService } from './cookie.service';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'User or username already exists' })
  @Post(['register', 'signup'])
  async signup(@Body() signupDto: SignupDTO) {
    const user = await this.authService.signup(signupDto);
    return {
      status: 'success',
      message:
        'User registered successfully. Please verify the OTP sent to your email.',
      user,
    };
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Email not verified or suspended' })
  @Post(['login', 'signin'])
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);
    this.cookieService.setAuthCookies(
      response,
      tokens.accessToken,
      tokens.refreshToken,
    );
    return {
      status: 'success',
      message: 'User logged in successfully',
      user,
      tokens,
    };
  }

  @ApiOperation({ summary: 'Authenticate / register using Google OAuth' })
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  @Post('google')
  @HttpCode(200)
  async googleAuth(
    @Body() googleAuthDto: GoogleAuthDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = await this.authService.googleAuth(googleAuthDto);
    this.cookieService.setAuthCookies(
      response,
      tokens.accessToken,
      tokens.refreshToken,
    );
    return {
      status: 'success',
      message: 'Google authentication successful',
      user,
      tokens,
    };
  }

  @ApiOperation({ summary: 'Request password reset OTP via email' })
  @ApiResponse({ status: 200, description: 'OTP sent if user exists' })
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDTO) {
    await this.authService.forgotPassword(dto);
    return {
      status: 'success',
      message:
        'If an account with that email exists, password reset instructions have been sent.',
    };
  }

  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    await this.authService.resetPassword(dto);
    return {
      status: 'success',
      message:
        'Password reset successfully. You can now log in with your new password.',
    };
  }

  @ApiOperation({ summary: 'Verify email with OTP' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @Post(['verify-email', 'verify-otp', 'verify'])
  @HttpCode(200)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDTO) {
    await this.authService.verifyOtp(verifyOtpDto);
    return {
      status: 'success',
      message: 'Email verified successfully',
    };
  }

  @ApiOperation({ summary: 'Resend email verification OTP' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @Post(['resend-verification', 'resend-otp', 'resend'])
  @HttpCode(200)
  async resendOtp(@Body() sendOtpDto: SendOtpDTO) {
    await this.authService.resendOtp(sendOtpDto.email);
    return {
      status: 'success',
      message: 'OTP resent successfully',
    };
  }

  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Returns authenticated user' })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() request: AuthenticatedRequest) {
    return this.authService.getMe(request.user.sub);
  }

  @ApiOperation({ summary: 'Refresh JWT access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() request: Request,
    @Body() refreshTokenDto: RefreshTokenDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = request.cookies as Record<string, unknown>;
    const refreshToken =
      (cookies?.refresh_token as string) || refreshTokenDto?.refreshToken;

    if (typeof refreshToken !== 'string' || !refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    const tokens = await this.authService.refreshAccessToken(refreshToken);
    this.cookieService.setAuthCookies(
      response,
      tokens.accessToken,
      tokens.refreshToken,
    );
    return {
      status: 'success',
      message: 'Tokens refreshed successfully',
      tokens,
    };
  }

  @ApiOperation({ summary: 'Logout and clear auth cookies' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Post(['logout', 'signout'])
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    this.cookieService.clearAuthCookies(response);
    return {
      status: 'success',
      message: 'Logout successful',
    };
  }
}
