import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { OptionalJwtAuthGuard } from 'src/infra/guards/optional-jwt.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() request: AuthenticatedRequest) {
    const user = await this.usersService.findById(request.user.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('search')
  async search(
    @Req() req: AuthenticatedRequest,
    @Query('q') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const currentUserId = req.user?.sub;
    const result = await this.usersService.searchUsers(
      query,
      page ? Number(page) : 1,
      limit ? Number(limit) : 12,
      currentUserId,
    );
    return { status: 'success', ...result };
  }

  @Get('profile/:username')
  async getProfileByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    return user;
  }

  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return user;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateProfile(
      request.user.sub,
      dto,
    );
    return {
      status: 'success',
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  @Post('profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Req() request: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedUser = await this.usersService.updateProfilePicture(
      request.user.sub,
      file,
    );
    return {
      status: 'success',
      message: 'Profile picture uploaded successfully',
      profilePicture: updatedUser.profilePicture,
      user: updatedUser,
    };
  }

  @Post('cover-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverPicture(
    @Req() request: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedUser = await this.usersService.updateCoverPicture(
      request.user.sub,
      file,
    );
    return {
      status: 'success',
      message: 'Cover picture uploaded successfully',
      coverPicture: updatedUser.coverPicture,
      user: updatedUser,
    };
  }
}
