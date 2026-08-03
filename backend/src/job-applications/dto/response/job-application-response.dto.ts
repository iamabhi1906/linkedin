import { ApplicationStatus } from '../../enums/application-status.enum';

export class JobApplicationResponseDto {
  id!: string;

  jobId!: string;

  applicantId!: string;

  resumeUrl?: string;

  coverLetter?: string;

  phone?: string;

  email?: string;

  status!: ApplicationStatus;

  createdAt!: Date;
}
