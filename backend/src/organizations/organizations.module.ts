import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { CreateOrganizationService } from './services/create-organization.service';
import { GetOrganizationService } from './services/get-organization.service';
import { UpdateOrganizationService } from './services/update-organization.service';
import { DeleteOrganizationService } from './services/delete-organization.service';
import { OrganizationMemberService } from './services/organization-member.service';
import { OrganizationLogoService } from './services/organization-logo.service';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationMemberController } from './controllers/organization-member.controller';
import { UsersModule } from '../users/users.module';
import { UploadsModule } from '../uploads/uploads.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationMember]),
    UsersModule,
    UploadsModule,
    TokenModule,
  ],
  controllers: [OrganizationController, OrganizationMemberController],
  providers: [
    CreateOrganizationService,
    GetOrganizationService,
    UpdateOrganizationService,
    DeleteOrganizationService,
    OrganizationMemberService,
    OrganizationLogoService,
  ],
  exports: [
    CreateOrganizationService,
    GetOrganizationService,
    OrganizationMemberService,
  ],
})
export class OrganizationsModule {}
