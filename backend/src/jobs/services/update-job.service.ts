import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { UpdateJobDto } from '../dto/request/update-job.dto';
import { OrganizationMember } from '../../organizations/entities/organization-member.entity';
import { OrganizationRole } from '../../organizations/enums/organization-role.enum';

@Injectable()
export class UpdateJobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(
    jobId: string,
    userId: string,
    dto: UpdateJobDto,
  ): Promise<Job> {
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
          'You do not have permission to update this job',
        );
      }
    }

    Object.assign(job, dto);
    return await this.jobRepository.save(job);
  }
}
