import { User } from '../user/user.type';

export interface CreateOrgPayload {
  name: string;
  slug?: string;
  tagline?: string;
  about?: string;
  website?: string;
  industry?: string;
  organizationType?: string;
  location?: string;
  employeeCountRange?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  about: string;
  website: string;
  industry: string;
  organizationType: string;
  logo: string | null;
  cover: string | null;
  location: string | null;
  employeeCountRange: string | null;
  ownerId: string;
  owner: User | null;
  activityCount?: number | null;
  visitorsCount?: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}
