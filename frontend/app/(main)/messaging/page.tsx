'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Create as CreateIcon,
  ChatBubbleOutlined as ChatIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useSnackbar } from 'notistack';
import { messagingService } from '@/services/messaging/messaging.service';
import { followService, FollowUser } from '@/services/follows/follow.service';
import { Conversation, Message } from '@/features/messaging/messaging.type';
import styles from './messaging.module.css';

export default function MessagingPage() {
  const searchParams = useSearchParams();
  const targetUserIdParam = searchParams.get('targetUserId');

  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // New Chat Modal state
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [followingList, setFollowingList] = useState<FollowUser[]>([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = useCallback(async () => {
    try {
      const list = await messagingService.getConversations();
      setConversations(list);
      return list;
    } catch {
      return [];
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const res = await messagingService.getMessages(convId);
      setMessages(res.messages || []);
    } catch {
      enqueueSnackbar('Failed to load messages', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  // Initial setup & handling targetUserIdParam
  useEffect(() => {
    fetchConversations().then(async (convs) => {
      if (targetUserIdParam) {
        try {
          const conv = await messagingService.getOrCreate(targetUserIdParam);
          setSelectedConversation(conv);
          fetchMessages(conv.id);
        } catch (err: unknown) {
          enqueueSnackbar(
            (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Could not start conversation',
            { variant: 'error' },
          );
        }
      } else if (convs.length > 0 && !selectedConversation) {
        setSelectedConversation(convs[0]);
        fetchMessages(convs[0].id);
      }
    });
  }, [targetUserIdParam]); // eslint-disable-line react-hooks/exhaustive-deps

  // Periodic polling for active conversation messages (pure DB based refresh)
  useEffect(() => {
    if (!selectedConversation?.id) return;

    const interval = setInterval(() => {
      messagingService.getMessages(selectedConversation.id).then((res) => {
        setMessages(res.messages || []);
      }).catch(() => null);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedConversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setLoadingMessages(true);
    fetchMessages(conv.id).finally(() => setLoadingMessages(false));
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedConversation) return;
    if (!messageText.trim() && !selectedFile) return;

    setSending(true);
    try {
      const newMsg = await messagingService.sendMessage(
        selectedConversation.id,
        messageText,
        selectedFile || undefined,
      );
      setMessages((prev) => [...prev, newMsg]);
      setMessageText('');
      setSelectedFile(null);
      fetchConversations();
    } catch (err: unknown) {
      enqueueSnackbar(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Failed to send message',
        { variant: 'error' },
      );
    } finally {
      setSending(false);
    }
  };

  const handleOpenNewChatModal = async () => {
    setNewChatOpen(true);
    setLoadingFollowing(true);
    try {
      const res = await followService.getFollowing(undefined, 1, 50);
      setFollowingList(res.following || []);
    } catch {
      enqueueSnackbar('Failed to load connections', { variant: 'error' });
    } finally {
      setLoadingFollowing(false);
    }
  };

  const handleStartChatWithUser = async (targetUserId: string) => {
    setNewChatOpen(false);
    try {
      const conv = await messagingService.getOrCreate(targetUserId);
      setSelectedConversation(conv);
      fetchConversations();
      fetchMessages(conv.id);
    } catch (err: unknown) {
      enqueueSnackbar(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Could not start conversation',
        { variant: 'error' },
      );
    }
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Box className={styles.messagingCard}>
        {/* Left Sidebar: Conversations List */}
        <Box className={styles.sidebar}>
          <Box className={styles.sidebarHeader}>
            <Typography variant="h6" className={styles.sidebarTitle}>
              Messaging
            </Typography>
            <IconButton onClick={handleOpenNewChatModal} size="small">
              <CreateIcon />
            </IconButton>
          </Box>

          <Box className={styles.searchBox}>
            <InputBase
              fullWidth
              placeholder="Search messages..."
              className={styles.searchInput}
              startAdornment={<SearchIcon fontSize="small" sx={{ mr: 1, color: '#666666' }} />}
            />
          </Box>

          {loadingConversations ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : conversations.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No active conversations yet. Start a new chat with your connections!
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CreateIcon />}
                onClick={handleOpenNewChatModal}
                sx={{ mt: 2, borderRadius: 4, textTransform: 'none' }}
              >
                New Message
              </Button>
            </Box>
          ) : (
            <Box className={styles.conversationList}>
              {conversations.map((conv) => {
                const active = selectedConversation?.id === conv.id;
                const other = conv.otherUser;
                const lastMsg = conv.lastMessage;

                return (
                  <Box
                    key={conv.id}
                    className={`${styles.conversationItem} ${active ? styles.activeConversation : ''}`}
                    onClick={() => handleSelectConversation(conv)}
                  >
                    <Avatar src={other?.profilePicture || undefined} sx={{ width: 48, height: 48, backgroundColor: '#0A66C2' }}>
                      {other?.name?.[0] || 'U'}
                    </Avatar>

                    <Box className={styles.conversationDetails}>
                      <Box className={styles.userNameRow}>
                        <Typography variant="subtitle2" className={styles.userName}>
                          {other?.name || 'User'}
                        </Typography>
                        {lastMsg && (
                          <Typography variant="caption" className={styles.timestamp}>
                            {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="caption" className={styles.lastMessage}>
                        {lastMsg ? lastMsg.content || '📷 Media Attachment' : 'No messages yet'}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        {/* Right Pane: Active Chat Room */}
        <Box className={styles.chatPane}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <Box className={styles.chatHeader}>
                <Box className={styles.chatHeaderUser}>
                  <Avatar src={selectedConversation.otherUser?.profilePicture || undefined} sx={{ backgroundColor: '#0A66C2' }}>
                    {selectedConversation.otherUser?.name?.[0] || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {selectedConversation.otherUser?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedConversation.otherUser?.headline || 'LinkedIn Connection'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Messages Feed */}
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
                      <Box
                        key={msg.id}
                        className={`${styles.messageBubble} ${isMe ? styles.myMessage : styles.theirMessage}`}
                      >
                        {msg.content && <Typography variant="body2">{msg.content}</Typography>}

                        {msg.mediaUrl && (
                          <Box component="img" src={msg.mediaUrl} alt="attachment" className={styles.mediaAttachment} />
                        )}

                        <Typography variant="caption" className={styles.messageTime}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input Area */}
              <Box component="form" onSubmit={handleSendMessage} className={styles.inputArea}>
                {selectedFile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#EDF3F8', p: 1, borderRadius: 1 }}>
                    <Typography variant="caption" noWrap sx={{ flex: 1 }}>
                      📎 {selectedFile.name}
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
                    onChange={(e) => setMessageText(e.target.value)}
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

                  <IconButton
                    type="submit"
                    color="primary"
                    disabled={sending || (!messageText.trim() && !selectedFile)}
                  >
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
      </Box>

      {/* New Chat Modal */}
      <Dialog open={newChatOpen} onClose={() => setNewChatOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            New Message
          </Typography>
          <IconButton onClick={() => setNewChatOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 250 }}>
          {loadingFollowing ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : followingList.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              You are not following anyone yet. Connect with users to start messaging!
            </Typography>
          ) : (
            <List disablePadding>
              {followingList.map((user) => (
                <ListItem
                  key={user.id}
                  component="div"
                  onClick={() => handleStartChatWithUser(user.id)}
                  sx={{
                    py: 1.5,
                    borderBottom: '1px solid #F0F0F0',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#F3F6F8' },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={user.profilePicture || undefined} sx={{ backgroundColor: '#0A66C2' }}>
                      {user.name?.[0] || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{user.name}</Typography>}
                    secondary={<Typography variant="caption" color="text.secondary">{user.headline || 'LinkedIn Member'}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
