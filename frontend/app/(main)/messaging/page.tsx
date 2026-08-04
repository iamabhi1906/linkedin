'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import { useSnackbar } from 'notistack';
import { socketService } from '@/services/socket/socket.service';
import { Message, Conversation } from '@/features/messaging/messaging.type';
import { fetchConversationsThunk, getOrCreateConversationThunk, fetchMessagesThunk } from '@/features/messaging/messaging.action';
import { selectMessaging, setSelectedConversation, receiveSocketMessage } from '@/features/messaging/messaging.slice';
import { ConversationList } from '@/components/messaging/conversation-list';
import { ChatPane } from '@/components/messaging/chat-pane';
import { NewChatModal } from '@/components/messaging/new-chat-modal';
import styles from './messaging.module.css';

export default function MessagingPage() {
  const searchParams = useSearchParams();
  const targetUserIdParam = searchParams.get('targetUserId');

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { conversations, selectedConversation } = useAppSelector(selectMessaging);

  const [newChatOpen, setNewChatOpen] = useState(false);

  const selectedConversationRef = useRef<Conversation | null>(null);
  const conversationsRef = useRef<Conversation[]>(conversations);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const socket = socketService.connect();
    const handleNewMessage = (payload: { message: Message; conversationId: string }) => {
      dispatch(receiveSocketMessage(payload));
      if (!conversationsRef.current.some((c) => c.id === payload.conversationId)) {
        dispatch(fetchConversationsThunk());
      }
    };
    const handleConversationCreated = () => {
      dispatch(fetchConversationsThunk());
    };
    socket.on('newMessage', handleNewMessage);
    socket.on('conversationCreated', handleConversationCreated);
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('conversationCreated', handleConversationCreated);
    };
  }, [currentUser?.id, dispatch]);

  useEffect(() => {
    dispatch(fetchConversationsThunk())
      .unwrap()
      .then((convs) => {
        if (targetUserIdParam) {
          dispatch(getOrCreateConversationThunk(targetUserIdParam))
            .unwrap()
            .then((conv) => {
              socketService.joinConversation(conv.id);
              dispatch(fetchMessagesThunk({ conversationId: conv.id }));
            })
            .catch((err: unknown) => {
              enqueueSnackbar((err as string) || 'Could not start conversation', { variant: 'error' });
            });
        } else if (convs.length > 0 && !selectedConversationRef.current) {
          dispatch(setSelectedConversation(convs[0]));
          socketService.joinConversation(convs[0].id);
          dispatch(fetchMessagesThunk({ conversationId: convs[0].id }));
        }
      });
  }, [targetUserIdParam, dispatch, enqueueSnackbar]);

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Box className={styles.messagingCard}>
        <ConversationList onOpenNewChat={() => setNewChatOpen(true)} />
        <ChatPane />
      </Box>

      <NewChatModal open={newChatOpen} onClose={() => setNewChatOpen(false)} />
    </Container>
  );
}
