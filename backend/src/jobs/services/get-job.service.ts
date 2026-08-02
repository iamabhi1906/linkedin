import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';

@Injectable()
export class GetJobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async findById(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: { organization: true, postedBy: true },
    });
    if (!job) {
      throw new NotFoundException(`Job with ID '${id}' not found`);
    }
    return job;
  }

  async findByOrganization(organizationId: string): Promise<Job[]> {
    return await this.jobRepository.find({
      where: { organizationId },
      relations: { organization: true, postedBy: true },
      order: { createdAt: 'DESC' },
    });
  }
}
