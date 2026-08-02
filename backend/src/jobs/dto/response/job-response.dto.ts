import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobType } from '../../enums/job-type.enum';
import { WorkplaceType } from '../../enums/workplace-type.enum';
import { JobStatus } from '../../enums/job-status.enum';

export class JobResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiProperty({ enum: JobType })
  jobType: JobType;

  @ApiProperty({ enum: WorkplaceType })
  workplaceType: WorkplaceType;

  @ApiProperty({ enum: JobStatus })
  status: JobStatus;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  postedById: string;

  @ApiPropertyOptional()
  salaryRange?: string;

  @ApiProperty()
  applicationsCount: number;

  @ApiProperty()
  createdAt: Date;
}
