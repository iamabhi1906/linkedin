import { OrganizationType } from '../../enums/organization-type.enum';

export class OrganizationResponseDto {
  id!: string;

  name!: string;

  slug!: string;

  tagline?: string;

  about?: string;

  website?: string;

  industry?: string;

  organizationType!: OrganizationType;

  logo?: string;

  cover?: string;

  location?: string;

  employeeCountRange?: string;

  ownerId!: string;

  createdAt!: Date;

  updatedAt!: Date;
}
