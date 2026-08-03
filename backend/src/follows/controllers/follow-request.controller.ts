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
import { FollowRequestService } from '../services/follow-request.service';
import { FollowQueryService } from '../services/follow-query.service';
import { FollowPaginationDto } from '../dto/request/follow-pagination.dto';

@Controller('follows')
@UseGuards(JwtAuthGuard)
export class FollowRequestController {
  constructor(
    private readonly requestService: FollowRequestService,
    private readonly queryService: FollowQueryService,
  ) {}

  @Post('request/:targetUserId')
  async sendRequest(
    @Param('targetUserId') targetUserId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const result = await this.requestService.sendFollowRequest(
      req.user.sub,
      targetUserId,
    );
    return {
      status: 'success',
      message: result.message,
      follow: result.follow,
    };
  }

  @Post('requests/:identifier/accept')
  async acceptRequest(
    @Param('identifier') identifier: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const follow = await this.requestService.acceptFollowRequest(
      req.user.sub,
      identifier,
    );
    return {
      status: 'success',
      message: 'Follow request accepted',
      follow,
    };
  }

  @Post('requests/:identifier/reject')
  async rejectRequest(
    @Param('identifier') identifier: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const follow = await this.requestService.rejectFollowRequest(
      req.user.sub,
      identifier,
    );
    return {
      status: 'success',
      message: 'Follow request rejected',
      follow,
    };
  }

  @Delete('requests/:identifier/cancel')
  async cancelRequest(
    @Param('identifier') identifier: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.requestService.cancelSentRequest(req.user.sub, identifier);
    return {
      status: 'success',
      message: 'Follow request canceled successfully',
    };
  }

  @Get('requests/pending')
  async getPendingRequests(
    @Req() req: AuthenticatedRequest,
    @Query() pagination: FollowPaginationDto,
  ) {
    const result = await this.queryService.getPendingRequests(
      req.user.sub,
      pagination,
    );
    return { status: 'success', ...result };
  }

  @Get('requests/sent')
  async getSentRequests(
    @Req() req: AuthenticatedRequest,
    @Query() pagination: FollowPaginationDto,
  ) {
    const result = await this.queryService.getSentRequests(
      req.user.sub,
      pagination,
    );
    return { status: 'success', ...result };
  }
}
