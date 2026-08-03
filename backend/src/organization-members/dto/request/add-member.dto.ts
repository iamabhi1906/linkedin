import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { OrganizationRole } from '../../enums/organization-role.enum';

export class AddMemberDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(OrganizationRole)
  role?: OrganizationRole;
}
