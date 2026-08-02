'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import {
  ThumbUpOutlined as LikeIcon,
  ThumbUp as LikedIcon,
  CommentOutlined as CommentIcon,
  ShareOutlined as ShareIcon,
  SendOutlined as SendIcon,
  MoreHoriz as MoreIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { toggleLikeThunk } from '@/features/post/post.slice';
import { postService } from '@/services/posts/post.service';
import { useSnackbar } from 'notistack';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    author?: {
      firstName?: string;
      lastName?: string;
      headline?: string;
      profilePicture?: string;
    };
    organization?: {
      name: string;
      logo?: string;
    };
    media?: Array<{ fileUrl: string; mediaType: string }>;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  const handleToggleLike = async () => {
    try {
      const res = await dispatch(toggleLikeThunk(post.id)).unwrap();
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch {
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    }
  };

  const handleToggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      try {
        const res = await postService.getComments(post.id);
        setComments(res.comments || []);
      } catch {
        // silent error fallback
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await postService.addComment(post.id, commentText);
      setComments([res.comment, ...comments]);
      setCommentsCount(commentsCount + 1);
      setCommentText('');
    } catch (err: any) {
      enqueueSnackbar('Failed to add comment', { variant: 'error' });
    }
  };

  const authorName = post.organization
    ? post.organization.name
    : `${post.author?.firstName || 'User'} ${post.author?.lastName || ''}`;

  const authorAvatar = post.organization?.logo || post.author?.profilePicture;

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        mb: 2,
      }}
    >
      <CardContent sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Avatar src={authorAvatar}>{authorName[0]}</Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {authorName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {post.author?.headline || 'LinkedIn Member'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ whitespace: 'pre-line', mb: 1.5, fontSize: '0.9rem' }}>
          {post.content}
        </Typography>

        {post.media && post.media.length > 0 && (
          <Box sx={{ my: 1, borderRadius: 1, overflow: 'hidden' }}>
            {post.media.map((item, idx) => (
              <img
                key={idx}
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}/${item.fileUrl}`}
                alt="Post Media"
                style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            👍 {likesCount} likes
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            onClick={handleToggleComments}
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            {commentsCount} comments
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 0.5 }}>
          <Button
            startIcon={liked ? <LikedIcon sx={{ color: '#0A66C2' }} /> : <LikeIcon />}
            onClick={handleToggleLike}
            sx={{
              color: liked ? '#0A66C2' : '#666666',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Like
          </Button>
          <Button
            startIcon={<CommentIcon />}
            onClick={handleToggleComments}
            sx={{ color: '#666666', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Comment
          </Button>
          <Button
            startIcon={<ShareIcon />}
            sx={{ color: '#666666', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Share
          </Button>
          <Button
            startIcon={<SendIcon />}
            sx={{ color: '#666666', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Send
          </Button>
        </Box>

        {showComments && (
          <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #F3F2EF' }}>
            <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!commentText.trim()}
                sx={{ borderRadius: 4, textTransform: 'none', px: 2.5 }}
              >
                Post
              </Button>
            </Box>

            {comments.map((c) => (
              <Box key={c.id} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <Avatar src={c.user?.profilePicture} sx={{ width: 32, height: 32 }}>
                  {c.user?.firstName?.[0] || 'U'}
                </Avatar>
                <Box sx={{ backgroundColor: '#F2F2F2', borderRadius: 2, p: 1.2, width: '100%' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                    {c.user?.firstName} {c.user?.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    {c.content}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
