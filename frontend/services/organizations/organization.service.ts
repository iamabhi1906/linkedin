import { CreateOrgPayload } from '@/features/organization/organization.type';
export type { CreateOrgPayload };
import apiClient from '@/lib/axios';

export const organizationService = {
  async create(payload: CreateOrgPayload) {
    const response = await apiClient.post('/organizations', payload);
    return response.data;
  },

  async getUserOrganizations() {
    const response = await apiClient.get('/organizations/my');
    return response.data;
  },

  async getAll() {
    const response = await apiClient.get('/organizations/my');
    return response.data;
  },

  async getBySlug(slug: string) {
    const response = await apiClient.get(`/organizations/slug/${slug}`);
    return response.data;
  },

  async update(id: string, payload: Partial<CreateOrgPayload>) {
    const response = await apiClient.patch(`/organizations/${id}`, payload);
    return response.data;
  },

  async uploadLogo(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/organizations/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async uploadCover(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/organizations/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getMembers(orgId: string) {
    const response = await apiClient.get(`/organizations/${orgId}/members`);
    return response.data;
  },

  async addMember(orgId: string, userId: string, role?: string) {
    const response = await apiClient.post(`/organizations/${orgId}/members`, { userId, role });
    return response.data;
  },
};
