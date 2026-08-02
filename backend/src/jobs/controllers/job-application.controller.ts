import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { JobApplicationService } from '../services/job-application.service';
import { JobResumeService } from '../services/job-resume.service';
import { ApplyJobDto } from '../dto/request/apply-job.dto';
import { UpdateApplicationStatusDto } from '../dto/request/update-application-status.dto';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@ApiTags('Job Applications')
@Controller()
export class JobApplicationController {
  constructor(
    private readonly applicationService: JobApplicationService,
    private readonly resumeService: JobResumeService,
  ) {}

  @ApiOperation({ summary: 'Apply for a job with resume upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        coverLetter: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('jobs/:jobId/apply')
  async apply(
    @Param('jobId') jobId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: ApplyJobDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let resumeUrl: string | undefined;
    if (file) {
      resumeUrl = await this.resumeService.uploadResume(file);
    }
    const application = await this.applicationService.apply(
      jobId,
      req.user.sub,
      dto,
      resumeUrl,
    );
    return {
      status: 'success',
      message: 'Job application submitted successfully',
      application,
    };
  }

  @ApiOperation({ summary: 'List applications submitted by current user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-applications')
  async getMyApplications(@Req() req: AuthenticatedRequest) {
    const applications = await this.applicationService.getMyApplications(
      req.user.sub,
    );
    return { status: 'success', applications };
  }

  @ApiOperation({
    summary: 'List applications for a job (Org Admin / Recruiter)',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('jobs/:jobId/applications')
  async getJobApplications(
    @Param('jobId') jobId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const applications = await this.applicationService.getJobApplications(
      jobId,
      req.user.sub,
    );
    return { status: 'success', applications };
  }

  @ApiOperation({ summary: 'Update job application status' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('jobs/:jobId/applications/:applicationId/status')
  async updateStatus(
    @Param('jobId') jobId: string,
    @Param('applicationId') applicationId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    const application = await this.applicationService.updateStatus(
      jobId,
      applicationId,
      req.user.sub,
      dto,
    );
    return {
      status: 'success',
      message: 'Application status updated successfully',
      application,
    };
  }
}
