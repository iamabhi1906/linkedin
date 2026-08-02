import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMember } from '../entities/organization-member.entity';
import { AddMemberDto } from '../dto/request/add-member.dto';
import { UpdateMemberRoleDto } from '../dto/request/update-member-role.dto';
import { OrganizationRole } from '../enums/organization-role.enum';
import { UsersService } from '../../users/users.service';

@Injectable()
export class OrganizationMemberService {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
    private readonly usersService: UsersService,
  ) {}

  private async checkAdminOrOwnerPermission(
    orgId: string,
    requesterId: string,
  ): Promise<OrganizationMember> {
    const member = await this.memberRepository.findOne({
      where: { organizationId: orgId, userId: requesterId },
    });
    if (
      !member ||
      (member.role !== OrganizationRole.OWNER &&
        member.role !== OrganizationRole.ADMIN)
    ) {
      throw new ForbiddenException(
        'You do not have permission to manage members in this organization',
      );
    }
    return member;
  }

  async addMember(
    orgId: string,
    requesterId: string,
    dto: AddMemberDto,
  ): Promise<OrganizationMember> {
    await this.checkAdminOrOwnerPermission(orgId, requesterId);

    const user = await this.usersService.findById(dto.userId);
    if (!user) {
      throw new NotFoundException(`User with ID '${dto.userId}' not found`);
    }

    const existing = await this.memberRepository.findOne({
      where: { organizationId: orgId, userId: dto.userId },
    });
    if (existing) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    const newMember = this.memberRepository.create({
      organizationId: orgId,
      userId: dto.userId,
      role: dto.role ?? OrganizationRole.MEMBER,
    });

    return await this.memberRepository.save(newMember);
  }

  async updateRole(
    orgId: string,
    memberId: string,
    requesterId: string,
    dto: UpdateMemberRoleDto,
  ): Promise<OrganizationMember> {
    await this.checkAdminOrOwnerPermission(orgId, requesterId);

    const targetMember = await this.memberRepository.findOne({
      where: { id: memberId, organizationId: orgId },
    });
    if (!targetMember) {
      throw new NotFoundException('Member not found in organization');
    }

    if (targetMember.role === OrganizationRole.OWNER) {
      throw new ForbiddenException(
        'Cannot change role of the organization owner',
      );
    }

    targetMember.role = dto.role;
    return await this.memberRepository.save(targetMember);
  }

  async removeMember(
    orgId: string,
    memberId: string,
    requesterId: string,
  ): Promise<void> {
    const requester = await this.checkAdminOrOwnerPermission(
      orgId,
      requesterId,
    );

    const targetMember = await this.memberRepository.findOne({
      where: { id: memberId, organizationId: orgId },
    });
    if (!targetMember) {
      throw new NotFoundException('Member not found in organization');
    }

    if (targetMember.role === OrganizationRole.OWNER) {
      throw new ForbiddenException('Cannot remove the organization owner');
    }

    if (
      targetMember.role === OrganizationRole.ADMIN &&
      requester.role !== OrganizationRole.OWNER
    ) {
      throw new ForbiddenException('Only the owner can remove an admin');
    }

    await this.memberRepository.remove(targetMember);
  }

  async getMembers(orgId: string): Promise<OrganizationMember[]> {
    return await this.memberRepository.find({
      where: { organizationId: orgId },
      relations: { user: true },
      order: { createdAt: 'ASC' },
    });
  }
}
