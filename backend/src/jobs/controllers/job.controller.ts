import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { CreateJobService } from '../services/create-job.service';
import { GetJobService } from '../services/get-job.service';
import { UpdateJobService } from '../services/update-job.service';
import { DeleteJobService } from '../services/delete-job.service';
import { JobSearchService } from '../services/job-search.service';
import { CreateJobDto } from '../dto/request/create-job.dto';
import { UpdateJobDto } from '../dto/request/update-job.dto';
import { JobType } from '../enums/job-type.enum';
import { WorkplaceType } from '../enums/workplace-type.enum';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('jobs')
export class JobController {
  constructor(
    private readonly createJobService: CreateJobService,
    private readonly getJobService: GetJobService,
    private readonly updateJobService: UpdateJobService,
    private readonly deleteJobService: DeleteJobService,
    private readonly jobSearchService: JobSearchService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateJobDto) {
    const job = await this.createJobService.execute(req.user.sub, dto);
    return { status: 'success', message: 'Job posted successfully', job };
  }

  @Get('search')
  async search(
    @Query('q') q?: string,
    @Query('location') location?: string,
    @Query('role') role?: string,
    @Query('postedWithin') postedWithin?: number,
    @Query('jobType') jobType?: JobType,
    @Query('workplaceType') workplaceType?: WorkplaceType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.jobSearchService.search({
      q,
      location,
      role,
      postedWithin,
      jobType,
      workplaceType,
      page,
      limit,
    });
    return { status: 'success', ...result };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const job = await this.getJobService.findById(id);
    return { status: 'success', job };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateJobDto,
  ) {
    const job = await this.updateJobService.execute(id, req.user.sub, dto);
    return { status: 'success', message: 'Job updated successfully', job };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.deleteJobService.execute(id, req.user.sub);
    return { status: 'success', message: 'Job deleted successfully' };
  }
}
