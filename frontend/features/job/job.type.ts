export interface Job {
  id: string;
  title: string;
  role?: string;
  description: string;
  organizationId: string;
  organization?: {
    id: string;
    name: string;
    logo?: string;
    location?: string;
  };
  location?: string;
  experienceNeeded?: string;
  packageOffered?: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  workplaceType: 'ON_SITE' | 'HYBRID' | 'REMOTE';
  status: 'OPEN' | 'CLOSED';
  postedById: string;
  salaryRange?: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobPayload {
  title: string;
  role: string;
  description: string;
  organizationId: string;
  location: string;
  experienceNeeded: string;
  packageOffered: string;
  jobType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  workplaceType?: 'ON_SITE' | 'HYBRID' | 'REMOTE';
  salaryRange?: string;
}
