import { Job } from 'src/jobs/entities/job.entity';
import { ApplyJobDto } from '../dto/request/apply-job.dto';

export interface newJobApply {
  job: Job;
  applicantId: string;
  dto: ApplyJobDto;
  resumeUrl?: string;
}
