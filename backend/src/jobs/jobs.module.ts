import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobApplication } from '../job-applications/entities/job-application.entity';
import { OrganizationMember } from '../organization-members/entities/organization-member.entity';
import { CreateJobService } from './services/create-job.service';
import { GetJobService } from './services/get-job.service';
import { UpdateJobService } from './services/update-job.service';
import { DeleteJobService } from './services/delete-job.service';
import { JobSearchService } from './services/job-search.service';
import { JobController } from './controllers/job.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { TokenModule } from '../token/token.module';
import { JobApplicationsModule } from '../job-applications/job-applications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobApplication, OrganizationMember]),
    UploadsModule,
    TokenModule,
    JobApplicationsModule,
  ],
  controllers: [JobController],
  providers: [
    CreateJobService,
    GetJobService,
    UpdateJobService,
    DeleteJobService,
    JobSearchService,
  ],
  exports: [
    CreateJobService,
    GetJobService,
    JobSearchService,
  ],
})
export class JobsModule {}
