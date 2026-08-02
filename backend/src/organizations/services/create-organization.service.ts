import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Organization } from '../entities/organization.entity';
import { OrganizationMember } from '../entities/organization-member.entity';
import { CreateOrganizationDto } from '../dto/request/create-organization.dto';
import { OrganizationRole } from '../enums/organization-role.enum';

@Injectable()
export class CreateOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(
    ownerId: string,
    dto: CreateOrganizationDto,
  ): Promise<Organization> {
    let slug = dto.slug
      ? slugify(dto.slug, { lower: true, strict: true })
      : slugify(dto.name, { lower: true, strict: true });

    if (!slug) {
      slug = 'org-' + Date.now();
    }

    const existing = await this.orgRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(
        `Organization slug '${slug}' is already taken`,
      );
    }

    const organization = this.orgRepository.create({
      ...dto,
      slug,
      ownerId,
    });

    const savedOrg = await this.orgRepository.save(organization);

    const ownerMember = this.memberRepository.create({
      organizationId: savedOrg.id,
      userId: ownerId,
      role: OrganizationRole.OWNER,
    });
    await this.memberRepository.save(ownerMember);

    return savedOrg;
  }
}
