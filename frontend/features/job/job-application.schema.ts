import { z } from 'zod';

export const jobApplicationSchema = z.object({
  name: z.string().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(10, 'Valid phone number is required (min 10 digits)'),
  coverLetter: z.string().optional(),
});

export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;
