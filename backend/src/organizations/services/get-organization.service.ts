import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class GetOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
  ) {}

  async findById(id: string): Promise<Organization> {
    const org = await this.orgRepository.findOne({
      where: { id },
      relations: { owner: true, members: { user: true } },
    });
    if (!org) {
      throw new NotFoundException(`Organization with ID '${id}' not found`);
    }
    return org;
  }

  async findBySlug(slug: string): Promise<Organization> {
    const org = await this.orgRepository.findOne({
      where: { slug: slug.toLowerCase() },
      relations: { owner: true, members: { user: true } },
    });
    if (!org) {
      throw new NotFoundException(`Organization '${slug}' not found`);
    }
    return org;
  }

  async findAll(): Promise<Organization[]> {
    return await this.orgRepository.find({
      relations: { owner: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByOwner(ownerId: string): Promise<Organization[]> {
    return await this.orgRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }
}
