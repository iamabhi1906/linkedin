import { CreatePostPayload } from '@/features/post/post.type';
export type { CreatePostPayload };
import apiClient from '@/lib/axios';

export const postService = {
  async getFeed(page = 1, limit = 20) {
    const response = await apiClient.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  async create(payload: CreatePostPayload) {
    const response = await apiClient.post('/posts', payload);
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },

  async toggleLike(postId: string) {
    const response = await apiClient.post(`/posts/${postId}/likes`);
    return response.data;
  },

  async getComments(postId: string) {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return response.data;
  },

  async addComment(postId: string, content: string, parentId?: string) {
    const response = await apiClient.post(`/posts/${postId}/comments`, { content, parentId });
    return response.data;
  },

  async attachMedia(postId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/posts/${postId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
