'use client';

import { useEffect, useRef, useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, InputBase, Typography } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon, Close as CloseIcon, ChatBubbleOutlined as ChatIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import { selectMessaging } from '@/features/messaging/messaging.slice';
import { sendMessageThunk } from '@/features/messaging/messaging.action';
import { socketService } from '@/services/socket/socket.service';
import { useSnackbar } from 'notistack';
import styles from '@/app/(main)/messaging/messaging.module.css';

export const ChatPane: React.FC = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { selectedConversation, messages, loadingMessages, sending } = useAppSelector(selectMessaging);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = e.target.value;
    setMessageText(text);

    if (selectedConversation) {
      socketService.sendTyping(selectedConversation.id, true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (selectedConversation) {
          socketService.sendTyping(selectedConversation.id, false);
        }
      }, 2000);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedConversation) return;
    if (!messageText.trim() && !selectedFile) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socketService.sendTyping(selectedConversation.id, false);

    try {
      await dispatch(
        sendMessageThunk({
          conversationId: selectedConversation.id,
          content: messageText,
          file: selectedFile || undefined,
        }),
      ).unwrap();
      setMessageText('');
      setSelectedFile(null);
    } catch (err: unknown) {
      enqueueSnackbar((err as string) || 'Failed to send message', {
        variant: 'error',
      });
    }
  };

  return (
    <Box className={styles.chatPane}>
      {selectedConversation ? (
        <>
          <Box className={styles.chatHeader}>
            <Box className={styles.chatHeaderUser}>
              <Box className={styles.avatarWrapper}>
                <Avatar src={selectedConversation.otherUser?.profilePicture || undefined} sx={{ backgroundColor: '#0A66C2' }}>
                  {selectedConversation.otherUser?.name?.[0] || 'U'}
                </Avatar>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedConversation.otherUser?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedConversation.otherUser?.headline || 'LinkedIn Connection'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.messagesFeed}>
            {loadingMessages ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : messages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Say hello to {selectedConversation.otherUser?.name}!
                </Typography>
              </Box>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <Box key={msg.id} className={`${styles.messageBubble} ${isMe ? styles.myMessage : styles.theirMessage}`}>
                    {msg.content && <Typography variant="body2">{msg.content}</Typography>}

                    {msg.mediaUrl && <Box component="img" src={msg.mediaUrl} alt="attachment" className={styles.mediaAttachment} />}

                    <Typography variant="caption" className={styles.messageTime}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Box component="form" onSubmit={handleSendMessage} className={styles.inputArea}>
            {selectedFile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#EDF3F8', p: 1, borderRadius: 1 }}>
                <Typography variant="caption" noWrap sx={{ flex: 1 }}>
                  {selectedFile.name}
                </Typography>
                <IconButton size="small" onClick={() => setSelectedFile(null)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            <Box className={styles.inputRow}>
              <InputBase
                fullWidth
                multiline
                maxRows={3}
                placeholder="Write a message..."
                value={messageText}
                onChange={handleTextChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                sx={{ fontSize: '0.9rem' }}
              />

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                }}
              />

              <IconButton onClick={() => fileInputRef.current?.click()} size="small">
                <AttachFileIcon />
              </IconButton>

              <IconButton type="submit" color="primary" disabled={sending || (!messageText.trim() && !selectedFile)}>
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </>
      ) : (
        <Box className={styles.emptyState}>
          <ChatIcon sx={{ fontSize: 64, color: '#CCCCCC', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D2226' }}>
            Select a conversation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose from your existing messages or start a new conversation.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
