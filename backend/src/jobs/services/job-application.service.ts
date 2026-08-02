import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JobApplication } from '../entities/job-application.entity';
import { ApplyJobDto } from '../dto/request/apply-job.dto';
import { UpdateApplicationStatusDto } from '../dto/request/update-application-status.dto';
import { OrganizationMember } from '../../organizations/entities/organization-member.entity';
import { OrganizationRole } from '../../organizations/enums/organization-role.enum';
import { ApplicationStatus } from '../enums/application-status.enum';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(JobApplication)
    private readonly applicationRepository: Repository<JobApplication>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  async apply(
    jobId: string,
    applicantId: string,
    dto: ApplyJobDto,
    resumeUrl?: string,
  ): Promise<JobApplication> {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const existing = await this.applicationRepository.findOne({
      where: { jobId, applicantId },
    });
    if (existing) {
      throw new ConflictException('You have already applied for this job');
    }

    const application = this.applicationRepository.create({
      jobId,
      applicantId,
      coverLetter: dto.coverLetter,
      phone: dto.phone,
      email: dto.email,
      resumeUrl,
      status: ApplicationStatus.APPLIED,
    });

    const saved = await this.applicationRepository.save(application);

    job.applicationsCount += 1;
    await this.jobRepository.save(job);

    return saved;
  }

  async updateStatus(
    jobId: string,
    applicationId: string,
    userId: string,
    dto: UpdateApplicationStatusDto,
  ): Promise<JobApplication> {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.postedById !== userId) {
      const member = await this.memberRepository.findOne({
        where: { organizationId: job.organizationId, userId },
      });
      if (
        !member ||
        (member.role !== OrganizationRole.OWNER &&
          member.role !== OrganizationRole.ADMIN)
      ) {
        throw new ForbiddenException(
          'You do not have permission to manage applications for this job',
        );
      }
    }

    const application = await this.applicationRepository.findOne({
      where: { id: applicationId, jobId },
    });
    if (!application) {
      throw new NotFoundException('Job application not found');
    }

    application.status = dto.status;
    return await this.applicationRepository.save(application);
  }

  async getJobApplications(
    jobId: string,
    userId: string,
  ): Promise<JobApplication[]> {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.postedById !== userId) {
      const member = await this.memberRepository.findOne({
        where: { organizationId: job.organizationId, userId },
      });
      if (
        !member ||
        (member.role !== OrganizationRole.OWNER &&
          member.role !== OrganizationRole.ADMIN)
      ) {
        throw new ForbiddenException(
          'You do not have permission to view applications for this job',
        );
      }
    }

    return await this.applicationRepository.find({
      where: { jobId },
      relations: { applicant: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getMyApplications(applicantId: string): Promise<JobApplication[]> {
    return await this.applicationRepository.find({
      where: { applicantId },
      relations: { job: { organization: true } },
      order: { createdAt: 'DESC' },
    });
  }
}
