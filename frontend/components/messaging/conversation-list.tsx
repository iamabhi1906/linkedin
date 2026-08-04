'use client';
import { Avatar, Box, Button, CircularProgress, IconButton, InputBase, Typography } from '@mui/material';
import { Search as SearchIcon, Create as CreateIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectMessaging, setSelectedConversation } from '@/features/messaging/messaging.slice';
import { fetchMessagesThunk } from '@/features/messaging/messaging.action';
import { socketService } from '@/services/socket/socket.service';
import { Conversation } from '@/features/messaging/messaging.type';
import styles from '@/app/(main)/messaging/messaging.module.css';

interface ConversationListProps {
  onOpenNewChat: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({ onOpenNewChat }) => {
  const dispatch = useAppDispatch();
  const { conversations, selectedConversation, loadingConversations } = useAppSelector(selectMessaging);

  const handleSelectConversation = (conv: Conversation) => {
    if (selectedConversation?.id) {
      socketService.leaveConversation(selectedConversation.id);
    }
    dispatch(setSelectedConversation(conv));
    socketService.joinConversation(conv.id);
    dispatch(fetchMessagesThunk({ conversationId: conv.id }));
  };

  return (
    <Box className={styles.sidebar}>
      <Box className={styles.sidebarHeader}>
        <Typography variant="h6" className={styles.sidebarTitle}>
          Messaging
        </Typography>
        <IconButton onClick={onOpenNewChat} size="small" color="primary">
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
            onClick={onOpenNewChat}
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
                <Box className={styles.avatarWrapper}>
                  <Avatar src={other?.profilePicture || undefined} sx={{ width: 48, height: 48, backgroundColor: '#0A66C2' }}>
                    {other?.name?.[0] || 'U'}
                  </Avatar>
                </Box>

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
                    {lastMsg ? lastMsg.content || 'Media Attachment' : 'No messages yet'}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
