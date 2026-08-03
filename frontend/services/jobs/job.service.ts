import apiClient from '@/lib/axios';

import { CreateJobPayload } from '@/features/job/job.type';
export type { CreateJobPayload };

export interface JobSearchQuery {
  q?: string;
  location?: string;
  role?: string;
  postedWithin?: number;
  jobType?: string;
  workplaceType?: string;
  page?: number;
  limit?: number;
}

export const jobService = {
  async search(query: JobSearchQuery) {
    const params = new URLSearchParams();
    if (query.q) params.append('q', query.q);
    if (query.location) params.append('location', query.location);
    if (query.role) params.append('role', query.role);
    if (query.postedWithin) params.append('postedWithin', query.postedWithin.toString());
    if (query.jobType) params.append('jobType', query.jobType);
    if (query.workplaceType) params.append('workplaceType', query.workplaceType);
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    const response = await apiClient.get(`/jobs/search?${params.toString()}`);
    return response.data;
  },

  async create(payload: CreateJobPayload) {
    const response = await apiClient.post('/jobs', payload);
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  async apply(jobId: string, coverLetter?: string, phone?: string, email?: string, file?: File, name?: string) {
    const formData = new FormData();
    if (name) formData.append('name', name);
    if (coverLetter) formData.append('coverLetter', coverLetter);
    if (phone) formData.append('phone', phone);
    if (email) formData.append('email', email);
    if (file) formData.append('file', file);

    const response = await apiClient.post(`/jobs/${jobId}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getMyApplications() {
    const response = await apiClient.get('/my-applications');
    return response.data;
  },
};
