import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './entities/job-application.entity';
import { Job } from '../jobs/entities/job.entity';
import { OrganizationMember } from '../organization-members/entities/organization-member.entity';
import { JobApplicationService } from './services/job-application.service';
import { JobResumeService } from './services/job-resume.service';
import { JobApplicationController } from './controllers/job-application.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication, Job, OrganizationMember]),
    UploadsModule,
    TokenModule,
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService, JobResumeService],
  exports: [JobApplicationService, JobResumeService],
})
export class JobApplicationsModule {}
