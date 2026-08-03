import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { FollowService } from '../services/follow.service';
import { FollowQueryService } from '../services/follow-query.service';
import { FollowPaginationDto } from '../dto/request/follow-pagination.dto';

@Controller('follows')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(
    private readonly followService: FollowService,
    private readonly followQueryService: FollowQueryService,
  ) {}

  @Post('direct/:targetUserId')
  async directFollow(
    @Param('targetUserId') targetUserId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const follow = await this.followService.directFollow(
      req.user.sub,
      targetUserId,
    );
    return {
      status: 'success',
      message: 'Followed user successfully',
      follow,
    };
  }

  @Delete('unfollow/:targetUserId')
  async unfollow(
    @Param('targetUserId') targetUserId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.followService.unfollow(req.user.sub, targetUserId);
    return {
      status: 'success',
      message: 'Unfollowed user successfully',
    };
  }

  @Delete('followers/:followerId')
  async removeFollower(
    @Param('followerId') followerId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.followService.removeFollower(req.user.sub, followerId);
    return {
      status: 'success',
      message: 'Follower removed successfully',
    };
  }

  @Get('followers')
  async getMyFollowers(
    @Req() req: AuthenticatedRequest,
    @Query() pagination: FollowPaginationDto,
  ) {
    const result = await this.followQueryService.getFollowers(
      req.user.sub,
      pagination,
    );
    return { status: 'success', ...result };
  }

  @Get('users/:userId/followers')
  async getUserFollowers(
    @Param('userId') userId: string,
    @Query() pagination: FollowPaginationDto,
  ) {
    const result = await this.followQueryService.getFollowers(
      userId,
      pagination,
    );
    return { status: 'success', ...result };
  }

  @Get('following')
  async getMyFollowing(
    @Req() req: AuthenticatedRequest,
    @Query() pagination: FollowPaginationDto,
  ) {
    const result = await this.followQueryService.getFollowing(
      req.user.sub,
      pagination,
    );
    return { status: 'success', ...result };
  }

  @Get('users/:userId/following')
  async getUserFollowing(
    @Param('userId') userId: string,
    @Query() pagination: FollowPaginationDto,
  ) {
    const result = await this.followQueryService.getFollowing(
      userId,
      pagination,
    );
    return { status: 'success', ...result };
  }

  @Get('status/:targetUserId')
  async getFollowStatus(
    @Param('targetUserId') targetUserId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const statusData = await this.followQueryService.getFollowStatus(
      req.user.sub,
      targetUserId,
    );
    return { status: 'success', ...statusData };
  }
}
