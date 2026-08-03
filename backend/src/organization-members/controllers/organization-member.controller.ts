import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { OrganizationMemberService } from '../services/organization-member.service';
import { AddMemberDto } from '../dto/request/add-member.dto';
import { UpdateMemberRoleDto } from '../dto/request/update-member-role.dto';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('organizations/:orgId/members')
export class OrganizationMemberController {
  constructor(private readonly memberService: OrganizationMemberService) {}

  @Get()
  async getMembers(@Param('orgId') orgId: string) {
    const members = await this.memberService.getMembers(orgId);
    return { status: 'success', members };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addMember(
    @Param('orgId') orgId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: AddMemberDto,
  ) {
    const member = await this.memberService.addMember(orgId, req.user.sub, dto);
    return {
      status: 'success',
      message: 'Member added successfully',
      member,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':memberId')
  async updateRole(
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    const member = await this.memberService.updateRole(
      orgId,
      memberId,
      req.user.sub,
      dto,
    );
    return {
      status: 'success',
      message: 'Member role updated successfully',
      member,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':memberId')
  async removeMember(
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.memberService.removeMember(orgId, memberId, req.user.sub);
    return {
      status: 'success',
      message: 'Member removed successfully',
    };
  }
}
