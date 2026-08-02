import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { JobType } from '../../enums/job-type.enum';
import { WorkplaceType } from '../../enums/workplace-type.enum';
import { JobStatus } from '../../enums/job-status.enum';

export class CreateJobDto {
  @ApiProperty({
    description: 'Job position title',
    example: 'Senior Software Engineer',
  })
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  @MaxLength(150)
  title!: string;

  @ApiProperty({ description: 'Job description & requirements' })
  @IsString()
  @IsNotEmpty({ message: 'Job description is required' })
  description!: string;

  @ApiProperty({ description: 'Organization ID posting the job' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiPropertyOptional({
    description: 'Job location',
    example: 'San Francisco, CA',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @ApiPropertyOptional({ enum: JobType, default: JobType.FULL_TIME })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @ApiPropertyOptional({ enum: WorkplaceType, default: WorkplaceType.ON_SITE })
  @IsOptional()
  @IsEnum(WorkplaceType)
  workplaceType?: WorkplaceType;

  @ApiPropertyOptional({ enum: JobStatus, default: JobStatus.OPEN })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @ApiPropertyOptional({
    description: 'Salary range',
    example: '$120,000 - $150,000 / year',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  salaryRange?: string;
}
