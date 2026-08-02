import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobApplication } from './entities/job-application.entity';
import { OrganizationMember } from '../organizations/entities/organization-member.entity';
import { CreateJobService } from './services/create-job.service';
import { GetJobService } from './services/get-job.service';
import { UpdateJobService } from './services/update-job.service';
import { DeleteJobService } from './services/delete-job.service';
import { JobSearchService } from './services/job-search.service';
import { JobApplicationService } from './services/job-application.service';
import { JobResumeService } from './services/job-resume.service';
import { JobController } from './controllers/job.controller';
import { JobApplicationController } from './controllers/job-application.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobApplication, OrganizationMember]),
    UploadsModule,
    TokenModule,
  ],
  controllers: [JobController, JobApplicationController],
  providers: [
    CreateJobService,
    GetJobService,
    UpdateJobService,
    DeleteJobService,
    JobSearchService,
    JobApplicationService,
    JobResumeService,
  ],
  exports: [
    CreateJobService,
    GetJobService,
    JobSearchService,
    JobApplicationService,
  ],
})
export class JobsModule {}
