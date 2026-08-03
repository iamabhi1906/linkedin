import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationMember } from './entities/organization-member.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationMemberService } from './services/organization-member.service';
import { OrganizationMemberController } from './controllers/organization-member.controller';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationMember, Organization]),
    TokenModule,
    UsersModule,
  ],
  controllers: [OrganizationMemberController],
  providers: [OrganizationMemberService],
  exports: [OrganizationMemberService],
})
export class OrganizationMembersModule {}
