import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile returned' })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() request: AuthenticatedRequest) {
    const user = await this.usersService.findById(request.user.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @ApiOperation({ summary: 'Get public user profile by username' })
  @ApiResponse({ status: 200, description: 'User profile found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('profile/:username')
  async getProfileByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Get public user profile by user ID' })
  @ApiResponse({ status: 200, description: 'User profile found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Update profile details' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 409, description: 'Username already taken' })
  @ApiBearerAuth()
  @Patch('profile')
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

  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (jpeg, png, webp, gif, max 5MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profile picture uploaded' })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Upload cover picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (jpeg, png, webp, gif, max 5MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cover picture uploaded' })
  @ApiBearerAuth()
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
