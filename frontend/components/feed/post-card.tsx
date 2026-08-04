'use client';

import { useEffect, useState } from 'react';
import { Avatar, Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { Repeat as RepeatIcon } from '@mui/icons-material';
import { Post } from '@/features/post/post.type';
import PostMediaCarousel from './post-media-carousel';
import CommentSection from '../comments/comment-section';
import { PostHeader } from './post-header';
import { PostStats } from './post-stats';
import { PostActions } from './post-actions';
import { RepostModal } from './repost-modal';
import styles from './post-card.module.css';

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [selectedReaction, setSelectedReaction] = useState<string>('like');
  const [isReposted, setIsReposted] = useState(post.isReposted || false);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);

  const targetPost = post.originalPost || post;
  const authorName: string = targetPost.organization?.name || targetPost.author?.name || 'User';
  const authorAvatar =
    (typeof targetPost.organization?.logo === 'string' ? targetPost.organization.logo : undefined) ||
    (typeof targetPost.author?.profilePicture === 'string' ? targetPost.author.profilePicture : undefined);
  const reposterName = post.author?.name || 'A connection';

  useEffect(() => {
    setLiked(post.isLiked || false);
    setLikesCount(post.likesCount || 0);
    const activeReaction = post.likeReaction || post.userReaction || post.userLike?.reaction || 'like';
    setSelectedReaction(activeReaction);
    setIsReposted(post.isReposted || false);
    setRepostsCount(post.repostsCount || 0);
  }, [post.isLiked, post.likesCount, post.likeReaction, post.userReaction, post.userLike, post.isReposted, post.repostsCount]);

  return (
    <Card elevation={0} className={styles.postCard}>
      <CardContent className={styles.cardContent}>
        {post.originalPost && (
          <Box className={styles.repostHeader}>
            <RepeatIcon className={styles.repostHeaderIcon} />
            <Typography variant="caption">
              <strong>{reposterName}</strong> reposted this
            </Typography>
          </Box>
        )}

        {post.originalPost && post.content && (
          <Typography variant="body2" className={styles.postContent}>
            {post.content}
          </Typography>
        )}

        {post.originalPost ? (
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
          <>
            <PostHeader post={post} />
            <Typography variant="body2" className={styles.postContent}>
              {post.content}
            </Typography>
            <PostMediaCarousel media={post.media} />
          </>
        )}

        <PostStats
          likesCount={likesCount}
          liked={liked}
          selectedReaction={selectedReaction}
          repostsCount={repostsCount}
          commentsCount={commentsCount}
          reactionCounts={post.reactionCounts}
          onToggleComments={() => setShowComments((prev) => !prev)}
        />

        <Divider />

        <PostActions
          postId={post.id}
          liked={liked}
          isReposted={isReposted}
          selectedReaction={selectedReaction}
          onLikedChange={(newLiked, newCount) => {
            setLiked(newLiked);
            setLikesCount(newCount);
          }}
          onReactionChange={(reaction) => setSelectedReaction(reaction)}
          onRepostedChange={(newReposted, countChange) => {
            setIsReposted(newReposted);
            setRepostsCount((prev) => Math.max(0, prev + countChange));
          }}
          onToggleComments={() => setShowComments((prev) => !prev)}
          onOpenRepostDialog={() => setRepostDialogOpen(true)}
        />

        <RepostModal
          open={repostDialogOpen}
          onClose={() => setRepostDialogOpen(false)}
          post={post}
          onRepostSuccess={() => {
            setIsReposted(true);
            setRepostsCount((prev) => prev + 1);
          }}
        />

        {showComments && (
          <CommentSection
            postId={post.id}
            postAuthorId={post.authorId}
            onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
          />
        )}
      </CardContent>
    </Card>
  );
}
