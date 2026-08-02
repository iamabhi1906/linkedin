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

  async updateProfile(payload: UpdateProfilePayload) {
    const response = await apiClient.patch('/users/me', payload);
    return response.data;
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
