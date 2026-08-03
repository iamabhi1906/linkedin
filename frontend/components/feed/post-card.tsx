'use client';

import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Divider, IconButton, Stack, Typography } from '@mui/material';
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
import { postService } from '@/services/posts/post.service';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useSnackbar } from 'notistack';
import { Post } from '@/features/post/post.type';
import { toggleLikeThunk } from '@/features/post/post.action';
import { type Comment } from '@/features/comment/comment.type';
import PostMediaCarousel from './post-media-carousel';
import CommentSection from '../comments/comment-section';
import styles from './post-card.module.css';

export default function PostCard({ post }: { post: Post }) {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  useEffect(() => {
    const nextLiked = post.isLiked || false;
    const nextLikes = post.likesCount || 0;
    if (nextLiked !== liked) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLiked(nextLiked);
    }
    if (nextLikes !== likesCount) {
      setLikesCount(nextLikes);
    }
  }, [post.isLiked, post.likesCount, liked, likesCount]);

  const handleToggleLike = async () => {
    try {
      const res = await dispatch(toggleLikeThunk(post.id)).unwrap();
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err: unknown) {
      enqueueSnackbar((err as { message?: string }).message || 'Failed to toggle like', { variant: 'error' });
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
        enqueueSnackbar('Failed to fetch comments', { variant: 'error' });
      }
    }
  };

  const authorName: string = post.organization?.name || post.author?.name || 'User';
  const authorAvatar =
    (typeof post.organization?.logo === 'string' ? post.organization.logo : undefined) ||
    (typeof post.author?.profilePicture === 'string' ? post.author.profilePicture : undefined);

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
            </Box>
          </Box>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ whitespace: 'pre-line', mb: 1.5, fontSize: '0.9rem' }}>
          {post.content}
        </Typography>

        <PostMediaCarousel media={post.media} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Stack direction="row" spacing={1}>
            <ThumbUpIcon color="primary" sx={{ fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {likesCount} likes
            </Typography>
          </Stack>
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
            className={styles.postButtons}
            sx={{ color: liked ? '#0A66C2' : '#666666' }}
          >
            Like
          </Button>
          <Button startIcon={<CommentIcon />} onClick={handleToggleComments} className={styles.postButtons}>
            Comment
          </Button>
          <Button startIcon={<ShareIcon />} className={styles.postButtons}>
            Share
          </Button>
          <Button startIcon={<SendIcon />} className={styles.postButtons}>
            Send
          </Button>
        </Box>

        {showComments && <CommentSection postId={post.id} comments={comments} onCommentAdded={() => setCommentsCount((prev) => prev + 1)} />}
      </CardContent>
    </Card>
  );
}
