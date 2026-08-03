import apiClient from '@/lib/axios';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  headline?: string;
  about?: string;
  location?: string;
  website?: string;
}

export const userService = {
  async getMe() {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  async getByUsername(username: string) {
    const response = await apiClient.get(`/users/username/${username}`);
    return response.data;
  },

  async search(query?: string, page = 1, limit = 12) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    const response = await apiClient.get(`/users/search?${params.toString()}`);
    return response.data;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const response = await apiClient.patch('/users/me', payload);
    return response.data.user;
  },

  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/users/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async uploadCoverPicture(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/users/cover-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
