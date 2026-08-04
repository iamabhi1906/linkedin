import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message } from './messaging.type';
import { fetchConversationsThunk, getOrCreateConversationThunk, fetchMessagesThunk, sendMessageThunk } from './messaging.action';
import { RootState } from '@/app/store';

export interface MessagingState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  sending: boolean;
  error: string | null;
}

const initialState: MessagingState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  loadingConversations: false,
  loadingMessages: false,
  sending: false,
  error: null,
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    setSelectedConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.selectedConversation = action.payload;
    },
    receiveSocketMessage: (state, action: PayloadAction<{ message: Message; conversationId: string }>) => {
      const { message, conversationId } = action.payload;
      if (state.selectedConversation?.id === conversationId) {
        const exists = state.messages.some((m) => m.id === message.id);
        if (!exists) {
          state.messages.push(message);
        }
      }
      const idx = state.conversations.findIndex((c) => c.id === conversationId);
      if (idx !== -1) {
        state.conversations[idx] = {
          ...state.conversations[idx],
          lastMessage: message,
          updatedAt: message.createdAt,
        };
        state.conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      }
    },
    receiveSocketConversation: (state, action: PayloadAction<Conversation>) => {
      const conv = action.payload;
      const idx = state.conversations.findIndex((c) => c.id === conv.id);
      if (idx !== -1) {
        state.conversations[idx] = conv;
      } else {
        state.conversations.unshift(conv);
      }
      state.conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    },
    clearMessagingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationsThunk.pending, (state) => {
        state.loadingConversations = true;
        state.error = null;
      })
      .addCase(fetchConversationsThunk.fulfilled, (state, action) => {
        state.loadingConversations = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversationsThunk.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload as string;
      })

      .addCase(getOrCreateConversationThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrCreateConversationThunk.fulfilled, (state, action) => {
        const conv = action.payload;
        state.selectedConversation = conv;
        const idx = state.conversations.findIndex((c) => c.id === conv.id);
        if (idx !== -1) {
          state.conversations[idx] = conv;
        } else {
          state.conversations.unshift(conv);
        }
      })
      .addCase(getOrCreateConversationThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchMessagesThunk.pending, (state) => {
        state.loadingMessages = true;
        state.error = null;
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.loadingMessages = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessagesThunk.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload as string;
      })

      .addCase(sendMessageThunk.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.sending = false;
        const message = action.payload;
        if (state.selectedConversation?.id === message.conversationId) {
          const exists = state.messages.some((m) => m.id === message.id);
          if (!exists) {
            state.messages.push(message);
          }
        }
        const idx = state.conversations.findIndex((c) => c.id === message.conversationId);
        if (idx !== -1) {
          state.conversations[idx] = {
            ...state.conversations[idx],
            lastMessage: message,
            updatedAt: message.createdAt,
          };
          state.conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        }
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedConversation, receiveSocketMessage, receiveSocketConversation, clearMessagingError } = messagingSlice.actions;

export const selectMessaging = (state: RootState) => state.messaging;

export default messagingSlice.reducer;
