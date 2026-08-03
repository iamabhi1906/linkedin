import { z } from 'zod';
import { JobType } from '../enums/job-type.enum';
import { WorkplaceType } from '../enums/workplace-type.enum';
import { JobStatus } from '../enums/job-status.enum';

export const createJobSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(150),
  role: z.string().min(1, 'Job role is required').max(150),
  description: z.string().min(1, 'Job description is required'),
  organizationId: z.string().uuid('Invalid organization ID'),
  location: z.string().min(1, 'Location is required').max(150),
  experienceNeeded: z.string().min(1, 'Experience needed is required').max(100),
  packageOffered: z.string().min(1, 'Package offered in INR (₹) is required').max(100),
  jobType: z.nativeEnum(JobType).optional(),
  workplaceType: z.nativeEnum(WorkplaceType).optional(),
  status: z.nativeEnum(JobStatus).optional(),
  salaryRange: z.string().optional(),
});

export type CreateJobZodSchema = z.infer<typeof createJobSchema>;
