import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import {
  fetchConversationsThunk,
  getOrCreateConversationThunk,
  fetchMessagesThunk,
  sendMessageThunk,
} from '@/features/messaging/messaging.action';
import {
  setSelectedConversation,
  receiveSocketMessage,
  receiveSocketConversation,
  clearMessagingError,
} from '@/features/messaging/messaging.slice';
import { Conversation, Message } from '@/features/messaging/messaging.type';

export function useMessaging() {
  const dispatch = useDispatch<AppDispatch>();
  const messagingState = useSelector((state: RootState) => state.messaging);

  const fetchConversations = () => dispatch(fetchConversationsThunk());
  const getOrCreateConversation = (targetUserId: string) =>
    dispatch(getOrCreateConversationThunk(targetUserId));
  const fetchMessages = (conversationId: string, page?: number, limit?: number) =>
    dispatch(fetchMessagesThunk({ conversationId, page, limit }));
  const sendMessage = (conversationId: string, content?: string, file?: File) =>
    dispatch(sendMessageThunk({ conversationId, content, file }));
  const selectConversation = (conversation: Conversation | null) =>
    dispatch(setSelectedConversation(conversation));
  const handleSocketMessage = (payload: { message: Message; conversationId: string }) =>
    dispatch(receiveSocketMessage(payload));
  const handleSocketConversation = (conversation: Conversation) =>
    dispatch(receiveSocketConversation(conversation));
  const clearError = () => dispatch(clearMessagingError());

  return {
    ...messagingState,
    fetchConversations,
    getOrCreateConversation,
    fetchMessages,
    sendMessage,
    selectConversation,
    handleSocketMessage,
    handleSocketConversation,
    clearError,
  };
}
