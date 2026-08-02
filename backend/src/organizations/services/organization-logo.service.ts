import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { OrganizationMember } from '../entities/organization-member.entity';
import { OrganizationRole } from '../enums/organization-role.enum';
import { UploadsService } from '../../uploads/uploads.service';
import { UploadFolder } from '../../uploads/enums/upload-folder.enum';

@Injectable()
export class OrganizationLogoService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
    private readonly uploadsService: UploadsService,
  ) {}

  private async checkPermission(orgId: string, userId: string): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: { organizationId: orgId, userId },
    });
    if (
      !member ||
      (member.role !== OrganizationRole.OWNER &&
        member.role !== OrganizationRole.ADMIN)
    ) {
      throw new ForbiddenException(
        'You do not have permission to manage media for this organization',
      );
    }
  }

  async uploadLogo(
    orgId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Organization> {
    await this.checkPermission(orgId, userId);
    const org = await this.orgRepository.findOne({ where: { id: orgId } });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    const filePath = await this.uploadsService.uploadSingle(
      file,
      UploadFolder.ORGANIZATION_LOGOS,
    );

    if (org.logo) {
      await this.uploadsService.deleteFile(org.logo).catch(() => null);
    }

    org.logo = filePath;
    return await this.orgRepository.save(org);
  }

  async uploadCover(
    orgId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Organization> {
    await this.checkPermission(orgId, userId);
    const org = await this.orgRepository.findOne({ where: { id: orgId } });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    const filePath = await this.uploadsService.uploadSingle(
      file,
      UploadFolder.ORGANIZATION_COVERS,
    );

    if (org.cover) {
      await this.uploadsService.deleteFile(org.cover).catch(() => null);
    }

    org.cover = filePath;
    return await this.orgRepository.save(org);
  }
}
