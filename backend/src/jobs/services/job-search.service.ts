import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JobType } from '../enums/job-type.enum';
import { WorkplaceType } from '../enums/workplace-type.enum';
import { JobStatus } from '../enums/job-status.enum';

export interface JobSearchQuery {
  q?: string;
  location?: string;
  jobType?: JobType;
  workplaceType?: WorkplaceType;
  page?: number;
  limit?: number;
}

@Injectable()
export class JobSearchService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async search(query: JobSearchQuery): Promise<{ jobs: Job[]; total: number }> {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;
    const skip = (page - 1) * limit;

    const qb = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .where('job.status = :status', { status: JobStatus.OPEN });

    if (query.q) {
      qb.andWhere(
        '(job.title ILIKE :q OR job.description ILIKE :q OR organization.name ILIKE :q)',
        { q: `%${query.q}%` },
      );
    }

    if (query.location) {
      qb.andWhere('job.location ILIKE :location', {
        location: `%${query.location}%`,
      });
    }

    if (query.jobType) {
      qb.andWhere('job.jobType = :jobType', { jobType: query.jobType });
    }

    if (query.workplaceType) {
      qb.andWhere('job.workplaceType = :workplaceType', {
        workplaceType: query.workplaceType,
      });
    }

    qb.orderBy('job.createdAt', 'DESC').skip(skip).take(limit);

    const [jobs, total] = await qb.getManyAndCount();
    return { jobs, total };
  }
}
