import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  headline: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  website: z.string().url('Must be a valid URL (e.g. https://example.com)').or(z.literal('')).optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
