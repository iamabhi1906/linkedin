import apiClient from '@/lib/axios';
import { Conversation, Message } from '@/features/messaging/messaging.type';

export const messagingService = {
  async getOrCreate(targetUserId: string): Promise<Conversation> {
    const response = await apiClient.post('/conversations', { targetUserId });
    return response.data.conversation;
  },

  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get('/conversations');
    return response.data.conversations || [];
  },

  async getMessages(
    conversationId: string,
    page = 1,
    limit = 50,
  ): Promise<{ messages: Message[]; total: number; totalPages: number }> {
    const response = await apiClient.get(`/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  },

  async sendMessage(
    conversationId: string,
    content?: string,
    file?: File,
  ): Promise<Message> {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (file) formData.append('file', file);

    const response = await apiClient.post(
      `/conversations/${conversationId}/messages`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data.message;
  },
};
