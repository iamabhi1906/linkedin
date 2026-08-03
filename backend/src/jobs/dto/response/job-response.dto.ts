import { JobType } from '../../enums/job-type.enum';
import { WorkplaceType } from '../../enums/workplace-type.enum';
import { JobStatus } from '../../enums/job-status.enum';

export class JobResponseDto {
  id!: string;

  title!: string;

  description!: string;

  location?: string;

  jobType!: JobType;

  workplaceType!: WorkplaceType;

  status!: JobStatus;

  organizationId!: string;

  postedById!: string;

  salaryRange?: string;

  applicationsCount!: number;

  createdAt!: Date;
}
