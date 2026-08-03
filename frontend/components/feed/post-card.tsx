'use client';

import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ThumbUpOutlined as LikeIcon,
  ThumbUp as LikedIcon,
  CommentOutlined as CommentIcon,
  Repeat as RepeatIcon,
  SendOutlined as SendIcon,
  MoreHoriz as MoreIcon,
  Add as AddIcon,
  Check as CheckIcon,
  HourglassEmpty as HourglassIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { postService } from '@/services/posts/post.service';
import { followService } from '@/services/follows/follow.service';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useSnackbar } from 'notistack';
import { Post } from '@/features/post/post.type';
import { toggleLikeThunk, repostThunk } from '@/features/post/post.action';
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
  const [isReposted, setIsReposted] = useState(post.isReposted || false);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount || 0);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  const [isFollowing, setIsFollowing] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // Repost Menu & Dialog state
  const [repostMenuAnchor, setRepostMenuAnchor] = useState<null | HTMLElement>(null);
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);
  const [repostThoughts, setRepostThoughts] = useState('');
  const [submittingRepost, setSubmittingRepost] = useState(false);

  const targetPost = post.originalPost || post;
  const isOtherUser = Boolean(
    targetPost.author && targetPost.author.id && targetPost.author.id !== currentUser?.id,
  );

  useEffect(() => {
    setLiked(post.isLiked || false);
    setLikesCount(post.likesCount || 0);
    setIsReposted(post.isReposted || false);
    setRepostsCount(post.repostsCount || 0);
  }, [post.isLiked, post.likesCount, post.isReposted, post.repostsCount]);

  useEffect(() => {
    if (isOtherUser && targetPost.author?.id) {
      followService
        .getFollowStatus(targetPost.author.id)
        .then((res) => {
          setIsFollowing(res.isFollowing);
          setHasPendingRequest(res.hasPendingRequestFromMe);
        })
        .catch(() => null);
    }
  }, [isOtherUser, targetPost.author?.id]);

  const handleToggleLike = async () => {
    try {
      const res = await dispatch(toggleLikeThunk(post.id)).unwrap();
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err: unknown) {
      enqueueSnackbar((err as { message?: string }).message || 'Failed to toggle like', {
        variant: 'error',
      });
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
    if (!targetPost.author?.id || loadingFollow) return;
    setLoadingFollow(true);
    try {
      const res = await followService.sendFollowRequest(targetPost.author.id);
      if (res.follow?.status === 'ACCEPTED') {
        setIsFollowing(true);
        setHasPendingRequest(false);
      } else {
        setHasPendingRequest(true);
      }
      enqueueSnackbar(res.message || 'Follow request sent', { variant: 'success' });
    } catch (err: unknown) {
      enqueueSnackbar(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          'Failed to send follow request',
        { variant: 'error' },
      );
    } finally {
      setLoadingFollow(false);
    }
  };

  // Repost Actions
  const handleOpenRepostMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRepostMenuAnchor(event.currentTarget);
  };

  const handleCloseRepostMenu = () => {
    setRepostMenuAnchor(null);
  };

  const handleInstantRepost = async () => {
    handleCloseRepostMenu();
    try {
      const res = await dispatch(repostThunk({ postId: post.id })).unwrap();
      setIsReposted(res.isReposted);
      setRepostsCount((prev) => (res.isReposted ? prev + 1 : Math.max(0, prev - 1)));
      enqueueSnackbar(res.message || 'Repost updated', { variant: 'success' });
    } catch (err: unknown) {
      enqueueSnackbar((err as { message?: string }).message || 'Failed to repost', {
        variant: 'error',
      });
    }
  };

  const handleOpenRepostDialog = () => {
    handleCloseRepostMenu();
    setRepostDialogOpen(true);
  };

  const handleCloseRepostDialog = () => {
    setRepostDialogOpen(false);
    setRepostThoughts('');
  };

  const handleSubmitRepostWithThoughts = async () => {
    if (submittingRepost) return;
    setSubmittingRepost(true);
    try {
      const res = await dispatch(
        repostThunk({ postId: post.id, content: repostThoughts }),
      ).unwrap();
      setIsReposted(true);
      setRepostsCount((prev) => prev + 1);
      enqueueSnackbar(res.message || 'Reposted with thoughts!', { variant: 'success' });
      handleCloseRepostDialog();
    } catch (err: unknown) {
      enqueueSnackbar((err as { message?: string }).message || 'Failed to repost', {
        variant: 'error',
      });
    } finally {
      setSubmittingRepost(false);
    }
  };

  const authorName: string =
    targetPost.organization?.name || targetPost.author?.name || 'User';
  const authorAvatar =
    (typeof targetPost.organization?.logo === 'string'
      ? targetPost.organization.logo
      : undefined) ||
    (typeof targetPost.author?.profilePicture === 'string'
      ? targetPost.author.profilePicture
      : undefined);

  const reposterName = post.author?.name || 'A connection';

  return (
    <Card elevation={0} className={styles.postCard}>
      <CardContent className={styles.cardContent}>
        {/* If this post is a Repost, display Repost Banner at top */}
        {post.originalPost && (
          <Box className={styles.repostHeader}>
            <RepeatIcon className={styles.repostHeaderIcon} />
            <Typography variant="caption">
              <strong>{reposterName}</strong> reposted this
            </Typography>
          </Box>
        )}

        {/* Repost Thoughts / Commentary (if quote repost) */}
        {post.originalPost && post.content && (
          <Typography variant="body2" className={styles.postContent}>
            {post.content}
          </Typography>
        )}

        {/* Main Post Header & Content */}
        {post.originalPost ? (
          /* Embedded Original Post Card */
          <Box className={styles.repostedCard}>
            <Box className={styles.headerRow}>
              <Box className={styles.authorBox}>
                <Avatar src={authorAvatar}>{authorName[0]}</Avatar>
                <Box className={styles.authorInfo}>
                  <Typography variant="subtitle2" className={styles.authorName}>
                    {authorName}
                  </Typography>
                  <Typography variant="caption" className={styles.authorHeadline}>
                    {targetPost.author?.headline || 'LinkedIn Member'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="body2" className={styles.postContent}>
              {targetPost.content}
            </Typography>

            <PostMediaCarousel media={targetPost.media} />
          </Box>
        ) : (
          /* Standard Post */
          <>
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
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<HourglassIcon />}
                    disabled
                    className={styles.pendingBtn}
                  >
                    Pending
                  </Button>
                )}

                {isOtherUser && isFollowing && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CheckIcon />}
                    disabled
                    className={styles.followingBtn}
                  >
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
          </>
        )}

        {/* Stats Row */}
        <Box className={styles.statsRow}>
          <Stack direction="row" spacing={1} className={styles.likesCountBox}>
            <ThumbUpIcon color="primary" className={styles.likeIconSmall} />
            <Typography variant="body2" className={styles.statsText}>
              {likesCount} likes
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            {repostsCount > 0 && (
              <Typography variant="caption" className={styles.statsText}>
                {repostsCount} reposts
              </Typography>
            )}
            <Typography
              variant="caption"
              onClick={handleToggleComments}
              className={styles.commentsCountText}
            >
              {commentsCount} comments
            </Typography>
          </Stack>
        </Box>

        <Divider />

        {/* Action Buttons Row */}
        <Box className={styles.actionButtonsRow}>
          <Button
            startIcon={liked ? <LikedIcon className={styles.likedIcon} /> : <LikeIcon />}
            onClick={handleToggleLike}
            className={liked ? styles.likedButton : styles.postButtons}
          >
            Like
          </Button>

          <Button
            startIcon={<CommentIcon />}
            onClick={handleToggleComments}
            className={styles.postButtons}
          >
            Comment
          </Button>

          <Button
            startIcon={
              <RepeatIcon className={isReposted ? styles.repostedIcon : undefined} />
            }
            onClick={handleOpenRepostMenu}
            className={isReposted ? styles.repostedButton : styles.postButtons}
          >
            Repost
          </Button>

          <Button startIcon={<SendIcon />} className={styles.postButtons}>
            Send
          </Button>
        </Box>

        {/* Repost Options Menu */}
        <Menu
          anchorEl={repostMenuAnchor}
          open={Boolean(repostMenuAnchor)}
          onClose={handleCloseRepostMenu}
        >
          <MenuItem onClick={handleInstantRepost} sx={{ py: 1.5, px: 2, gap: 1.5 }}>
            <RepeatIcon fontSize="small" color={isReposted ? 'success' : 'action'} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {isReposted ? 'Undo Repost' : 'Repost'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Instantly share this post with your network
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleOpenRepostDialog} sx={{ py: 1.5, px: 2, gap: 1.5 }}>
            <CreateIcon fontSize="small" color="action" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Repost with your thoughts
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Add your own comments before sharing
              </Typography>
            </Box>
          </MenuItem>
        </Menu>

        {/* Repost with Thoughts Modal */}
        <Dialog open={repostDialogOpen} onClose={handleCloseRepostDialog} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 600 }}>Repost with your thoughts</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What do you want to talk about?"
              value={repostThoughts}
              onChange={(e) => setRepostThoughts(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Embedded Post Preview */}
            <Box className={styles.repostedCard}>
              <Box className={styles.authorBox}>
                <Avatar src={authorAvatar}>{authorName[0]}</Avatar>
                <Box className={styles.authorInfo}>
                  <Typography variant="subtitle2" className={styles.authorName}>
                    {authorName}
                  </Typography>
                  <Typography variant="caption" className={styles.authorHeadline}>
                    {targetPost.author?.headline || 'LinkedIn Member'}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1, color: '#1D2226' }}>
                {targetPost.content}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseRepostDialog} color="inherit">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitRepostWithThoughts}
              disabled={submittingRepost}
              sx={{
                borderRadius: 4,
                backgroundColor: '#0A66C2',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Post
            </Button>
          </DialogActions>
        </Dialog>

        {/* Comment Section */}
        {showComments && (
          <CommentSection
            postId={post.id}
            comments={comments}
            onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
          />
        )}
      </CardContent>
    </Card>
  );
}
