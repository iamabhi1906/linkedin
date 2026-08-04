'use client';

import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectMessaging } from '@/features/messaging/messaging.slice';
import { getOrCreateConversationThunk, fetchMessagesThunk } from '@/features/messaging/messaging.action';
import { followService, FollowUser } from '@/services/follows/follow.service';
import { socketService } from '@/services/socket/socket.service';
import { useSnackbar } from 'notistack';

interface NewChatModalProps {
  open: boolean;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { selectedConversation } = useAppSelector(selectMessaging);

  const [followingList, setFollowingList] = useState<FollowUser[]>([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  useEffect(() => {
    if (open) {
      followService
        .getFollowing(undefined, 1, 50)
        .then((res) => {
          setFollowingList(res.following || []);
        })
        .catch(() => {
          enqueueSnackbar('Failed to load connections', { variant: 'error' });
        });
    }
  }, [open, enqueueSnackbar]);

  const handleStartChatWithUser = async (targetUserId: string) => {
    onClose();
    try {
      const conv = await dispatch(getOrCreateConversationThunk(targetUserId)).unwrap();
      if (selectedConversation?.id) {
        socketService.leaveConversation(selectedConversation.id);
      }
      socketService.joinConversation(conv.id);
      dispatch(fetchMessagesThunk({ conversationId: conv.id }));
    } catch (err: unknown) {
      enqueueSnackbar((err as string) || 'Could not start conversation', {
        variant: 'error',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          New Message
        </Typography>
        <IconButton onClick={onClose} size="small">
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
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {user.headline || 'LinkedIn Member'}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
