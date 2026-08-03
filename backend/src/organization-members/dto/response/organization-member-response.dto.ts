import { OrganizationRole } from '../../enums/organization-role.enum';

export class OrganizationMemberResponseDto {
  id!: string;

  organizationId!: string;

  userId!: string;

  role!: OrganizationRole;

  createdAt!: Date;
}
