import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OrganizationType } from '../../enums/organization-type.enum';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Organization name', example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty({ message: 'Organization name is required' })
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({
    description: 'Unique URL slug. Auto-generated if omitted.',
    example: 'acme-corp',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  slug?: string;

  @ApiPropertyOptional({
    description: 'Organization tagline',
    example: 'Building the future of software',
  })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  tagline?: string;

  @ApiPropertyOptional({
    description: 'Detailed about section',
    example: 'Acme Corp is a leading technology company.',
  })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({
    description: 'Website URL',
    example: 'https://acme.com',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    description: 'Industry category',
    example: 'Software Development',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({
    enum: OrganizationType,
    default: OrganizationType.COMPANY,
  })
  @IsOptional()
  @IsEnum(OrganizationType)
  organizationType?: OrganizationType;

  @ApiPropertyOptional({
    description: 'Primary location',
    example: 'San Francisco, CA',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @ApiPropertyOptional({
    description: 'Employee size range',
    example: '51-200 employees',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  employeeCountRange?: string;
}
