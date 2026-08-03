import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Organization } from '../entities/organization.entity';
import { OrganizationMember } from '../../organization-members/entities/organization-member.entity';
import { UpdateOrganizationDto } from '../dto/request/update-organization.dto';
import { OrganizationRole } from '../../organization-members/enums/organization-role.enum';

@Injectable()
export class UpdateOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(
    orgId: string,
    userId: string,
    dto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const org = await this.orgRepository.findOne({ where: { id: orgId } });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    const member = await this.memberRepository.findOne({
      where: { organizationId: orgId, userId },
    });

    if (
      !member ||
      (member.role !== OrganizationRole.OWNER &&
        member.role !== OrganizationRole.ADMIN)
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this organization',
      );
    }

    if (dto.slug && dto.slug.toLowerCase() !== org.slug.toLowerCase()) {
      const cleanSlug = slugify(dto.slug, { lower: true, strict: true });
      const existing = await this.orgRepository.findOne({
        where: { slug: cleanSlug },
      });
      if (existing && existing.id !== orgId) {
        throw new ConflictException(`Slug '${cleanSlug}' is already taken`);
      }
      dto.slug = cleanSlug;
    }

    Object.assign(org, dto);
    return await this.orgRepository.save(org);
  }
}
