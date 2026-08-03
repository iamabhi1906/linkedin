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
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Job role is required' })
  @MaxLength(150)
  role!: string;

  @IsString()
  @IsNotEmpty({ message: 'Job description is required' })
  description!: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  @MaxLength(150)
  location!: string;

  @IsString()
  @IsNotEmpty({ message: 'Experience needed is required' })
  @MaxLength(100)
  experienceNeeded!: string;

  @IsString()
  @IsNotEmpty({ message: 'Package offered in INR (₹) is required' })
  @MaxLength(100)
  packageOffered!: string;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @IsEnum(WorkplaceType)
  workplaceType?: WorkplaceType;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salaryRange?: string;
}
