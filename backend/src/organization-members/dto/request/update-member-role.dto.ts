import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrganizationRole } from '../../enums/organization-role.enum';

export class UpdateMemberRoleDto {
  @IsEnum(OrganizationRole)
  @IsNotEmpty()
  role!: OrganizationRole;
}
