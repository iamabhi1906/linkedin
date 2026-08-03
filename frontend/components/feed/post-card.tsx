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
  Add as AddIcon,
  Check as CheckIcon,
  HourglassEmpty as HourglassIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { postService } from '@/services/posts/post.service';
import { followService } from '@/services/follows/follow.service';
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
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  const [isFollowing, setIsFollowing] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const isOtherUser = Boolean(post.author && post.author.id && post.author.id !== currentUser?.id);

  useEffect(() => {
    const nextLiked = post.isLiked || false;
    const nextLikes = post.likesCount || 0;
    if (nextLiked !== liked) {
      setLiked(nextLiked);
    }
    if (nextLikes !== likesCount) {
      setLikesCount(nextLikes);
    }
  }, [post.isLiked, post.likesCount, liked, likesCount]);

  useEffect(() => {
    if (isOtherUser && post.author?.id) {
      followService
        .getFollowStatus(post.author.id)
        .then((res) => {
          setIsFollowing(res.isFollowing);
          setHasPendingRequest(res.hasPendingRequestFromMe);
        })
        .catch(() => null);
    }
  }, [isOtherUser, post.author?.id]);

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

  const handleFollowClick = async () => {
    if (!post.author?.id || loadingFollow) return;
    setLoadingFollow(true);
    try {
      const res = await followService.sendFollowRequest(post.author.id);
      if (res.follow?.status === 'ACCEPTED') {
        setIsFollowing(true);
        setHasPendingRequest(false);
      } else {
        setHasPendingRequest(true);
      }
      enqueueSnackbar(res.message || 'Follow request sent', { variant: 'success' });
    } catch (err: unknown) {
      enqueueSnackbar((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send follow request', {
        variant: 'error',
      });
    } finally {
      setLoadingFollow(false);
    }
  };

  const authorName: string = post.organization?.name || post.author?.name || 'User';
  const authorAvatar =
    (typeof post.organization?.logo === 'string' ? post.organization.logo : undefined) ||
    (typeof post.author?.profilePicture === 'string' ? post.author.profilePicture : undefined);

  return (
    <Card elevation={0} className={styles.postCard}>
      <CardContent className={styles.cardContent}>
        <Box className={styles.headerRow}>
          <Box className={styles.authorBox}>
            <Avatar src={authorAvatar}>{authorName[0]}</Avatar>
            <Box className={styles.authorInfo}>
              <Typography variant="subtitle2" className={styles.authorName}>
                {authorName}
              </Typography>
              <Typography variant="caption" className={styles.authorHeadline}>
                {post.author?.headline || 'LinkedIn Member'}
              </Typography>
            </Box>
          </Box>
          <Box className={styles.headerActions}>
            {isOtherUser && !isFollowing && !hasPendingRequest && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleFollowClick}
                disabled={loadingFollow}
                className={styles.followBtn}
              >
                Follow
              </Button>
            )}

            {isOtherUser && hasPendingRequest && (
              <Button variant="text" size="small" startIcon={<HourglassIcon />} disabled className={styles.pendingBtn}>
                Pending
              </Button>
            )}

            {isOtherUser && isFollowing && (
              <Button variant="outlined" size="small" startIcon={<CheckIcon />} disabled className={styles.followingBtn}>
                Following
              </Button>
            )}

            <IconButton size="small">
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" className={styles.postContent}>
          {post.content}
        </Typography>

        <PostMediaCarousel media={post.media} />

        <Box className={styles.statsRow}>
          <Stack direction="row" spacing={1} className={styles.likesCountBox}>
            <ThumbUpIcon color="primary" className={styles.likeIconSmall} />
            <Typography variant="body2" className={styles.statsText}>
              {likesCount} likes
            </Typography>
          </Stack>
          <Typography variant="caption" onClick={handleToggleComments} className={styles.commentsCountText}>
            {commentsCount} comments
          </Typography>
        </Box>

        <Divider />

        <Box className={styles.actionButtonsRow}>
          <Button
            startIcon={liked ? <LikedIcon className={styles.likedIcon} /> : <LikeIcon />}
            onClick={handleToggleLike}
            className={liked ? styles.likedButton : styles.postButtons}
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
