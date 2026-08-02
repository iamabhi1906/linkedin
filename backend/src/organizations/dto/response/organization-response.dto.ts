import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationType } from '../../enums/organization-type.enum';

export class OrganizationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  tagline?: string;

  @ApiPropertyOptional()
  about?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  industry?: string;

  @ApiProperty({ enum: OrganizationType })
  organizationType: OrganizationType;

  @ApiPropertyOptional()
  logo?: string;

  @ApiPropertyOptional()
  cover?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  employeeCountRange?: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
