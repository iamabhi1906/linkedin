import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { CreateJobDto } from '../dto/request/create-job.dto';
import { OrganizationMember } from '../../organization-members/entities/organization-member.entity';
import { OrganizationRole } from '../../organization-members/enums/organization-role.enum';
import { JobType } from '../enums/job-type.enum';
import { WorkplaceType } from '../enums/workplace-type.enum';
import { JobStatus } from '../enums/job-status.enum';
import { createJobSchema } from '../schemas/job.schema';

@Injectable()
export class CreateJobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(postedById: string, dto: CreateJobDto): Promise<Job> {
    const member = await this.memberRepository.findOne({
      where: { organizationId: dto.organizationId, userId: postedById },
    });

    if (!member) {
      throw new ForbiddenException(
        'You do not have permission to post jobs for this organization. Only people in an organization can create a job.',
      );
    }

    // Validate payload using Zod schema
    const validatedData = createJobSchema.partial({ jobType: true, workplaceType: true, status: true }).parse(dto);

    const job = this.jobRepository.create({
      ...validatedData,
      postedById,
      jobType: dto.jobType ?? JobType.FULL_TIME,
      workplaceType: dto.workplaceType ?? WorkplaceType.ON_SITE,
      status: dto.status ?? JobStatus.OPEN,
      applicationsCount: 0,
    });

    return await this.jobRepository.save(job);
  }
}
