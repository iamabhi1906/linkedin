import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { OrganizationRole } from '../../enums/organization-role.enum';

export class AddMemberDto {
  @ApiProperty({ description: 'UUID of the user to add as member' })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiPropertyOptional({
    enum: OrganizationRole,
    default: OrganizationRole.MEMBER,
  })
  @IsEnum(OrganizationRole)
  role?: OrganizationRole;
}
