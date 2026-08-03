import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(2, 'Job title is required (min 2 characters)').max(150),
  role: z.string().min(2, 'Job role is required (e.g. Software Engineer)').max(150),
  organizationId: z.string().min(1, 'Please select an organization'),
  location: z.string().min(2, 'Location is required (e.g. Bengaluru, India)').max(150),
  experienceNeeded: z.string().min(1, 'Experience needed is required (e.g. 2-5 Years)'),
  packageOffered: z.string().min(1, 'Package offered in INR (₹) is required (e.g. ₹12 - 18 LPA)'),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  workplaceType: z.enum(['ON_SITE', 'HYBRID', 'REMOTE']),
  description: z.string().min(10, 'Job description must be at least 10 characters'),
});

export type CreateJobFormValues = z.infer<typeof createJobSchema>;
