import { ApiProperty } from '@nestjs/swagger';
import { OrganizationRole } from '../../enums/organization-role.enum';

export class OrganizationMemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: OrganizationRole })
  role: OrganizationRole;

  @ApiProperty()
  createdAt: Date;
}
