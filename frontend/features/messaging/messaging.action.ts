import { createAsyncThunk } from '@reduxjs/toolkit';
import { messagingService } from '@/services/messaging/messaging.service';
import axios from 'axios';

export const fetchConversationsThunk = createAsyncThunk(
  'messaging/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const conversations = await messagingService.getConversations();
      return conversations;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversations');
      }
      return rejectWithValue('Failed to fetch conversations');
    }
  },
);

export const getOrCreateConversationThunk = createAsyncThunk(
  'messaging/getOrCreateConversation',
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const conversation = await messagingService.getOrCreate(targetUserId);
      return conversation;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || 'Could not start conversation');
      }
      return rejectWithValue('Could not start conversation');
    }
  },
);

export const fetchMessagesThunk = createAsyncThunk(
  'messaging/fetchMessages',
  async (
    { conversationId, page = 1, limit = 50 }: { conversationId: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const data = await messagingService.getMessages(conversationId, page, limit);
      return { conversationId, messages: data.messages || [], total: data.total, totalPages: data.totalPages };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || 'Failed to load messages');
      }
      return rejectWithValue('Failed to load messages');
    }
  },
);

export const sendMessageThunk = createAsyncThunk(
  'messaging/sendMessage',
  async (
    { conversationId, content, file }: { conversationId: string; content?: string; file?: File },
    { rejectWithValue },
  ) => {
    try {
      const message = await messagingService.sendMessage(conversationId, content, file);
      return message;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || 'Failed to send message');
      }
      return rejectWithValue('Failed to send message');
    }
  },
);
