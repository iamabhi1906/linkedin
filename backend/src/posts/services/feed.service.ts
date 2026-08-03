import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostVisibility } from '../enums/post-visibility.enum';
import { Follow } from '../../follows/entities/follow.entity';
import { FollowStatus } from '../../follows/enums/follow-status.enum';

export interface FeedPostResult {
  id: string;
  authorId: string;
  author: Post['author'];
  organizationId?: string;
  organization?: Post['organization'];
  content: string;
  visibility: PostVisibility;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  originalPostId?: string;
  originalPost?: Post;
  media: Post['media'];
  createdAt: Date;
  updatedAt: Date;
  isLiked: boolean;
  isReposted: boolean;
}

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async getFeed(
    page = 1,
    limit = 20,
    userId?: string,
  ): Promise<{ posts: FeedPostResult[]; total: number }> {
    const skip = (page - 1) * limit;

    let allowedAuthorIds: string[] = [];

    if (userId) {
      const follows = await this.followRepository.find({
        where: { followerId: userId, status: FollowStatus.ACCEPTED },
        select: { followingId: true },
      });
      const followingIds = follows.map((f) => f.followingId);
      if (followingIds.length > 0) {
        allowedAuthorIds = [userId, ...followingIds];
      }
    }

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.organization', 'organization')
      .leftJoinAndSelect('post.media', 'media')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.originalPost', 'originalPost')
      .leftJoinAndSelect('originalPost.author', 'origAuthor')
      .leftJoinAndSelect('originalPost.organization', 'origOrg')
      .leftJoinAndSelect('originalPost.media', 'origMedia')
      .leftJoinAndSelect('originalPost.likes', 'origLikes')
      .where('post.visibility = :visibility', { visibility: PostVisibility.PUBLIC });

    if (allowedAuthorIds.length > 0) {
      queryBuilder.andWhere(
        '(post.authorId IN (:...allowedAuthorIds) OR originalPost.authorId IN (:...allowedAuthorIds))',
        { allowedAuthorIds },
      );
    }

    queryBuilder
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [posts, total] = await queryBuilder.getManyAndCount();

    // Check which posts the current user has reposted
    let userRepostedOriginalIds = new Set<string>();
    if (userId && posts.length > 0) {
      const postIds = posts.map((p) => p.originalPostId || p.id);
      const userReposts = await this.postRepository.find({
        where: { authorId: userId, originalPostId: In(postIds) },
        select: { originalPostId: true },
      });
      userRepostedOriginalIds = new Set(
        userReposts
          .map((r) => r.originalPostId)
          .filter((id): id is string => Boolean(id)),
      );
    }

    const formattedPosts: FeedPostResult[] = posts.map((post) => {
      const isLiked = userId
        ? post.likes?.some((like) => like.userId === userId) || false
        : false;

      const rootId = post.originalPostId || post.id;
      const isReposted = userId ? userRepostedOriginalIds.has(rootId) : false;

      const { likes, ...rest } = post;

      if (rest.originalPost && rest.originalPost.likes) {
        delete (rest.originalPost as Partial<Post>).likes;
      }

      return {
        ...rest,
        isLiked,
        isReposted,
      };
    });

    return { posts: formattedPosts, total };
  }
}
