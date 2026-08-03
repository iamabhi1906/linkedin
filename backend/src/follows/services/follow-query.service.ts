import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';
import { FollowStatus } from '../enums/follow-status.enum';
import { FollowPaginationDto } from '../dto/request/follow-pagination.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FollowQueryService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getFollowers(userId: string, pagination: FollowPaginationDto) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const userExists = await this.userRepository.existsBy({ id: userId });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const [items, total] = await this.followRepository.findAndCount({
      where: { followingId: userId, status: FollowStatus.ACCEPTED },
      relations: { follower: true },
      select: {
        id: true,
        createdAt: true,
        follower: {
          id: true,
          name: true,
          username: true,
          headline: true,
          profilePicture: true,
          isPrivate: true,
        },
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      followers: items.map((item) => item.follower),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getFollowing(userId: string, pagination: FollowPaginationDto) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const userExists = await this.userRepository.existsBy({ id: userId });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const [items, total] = await this.followRepository.findAndCount({
      where: { followerId: userId, status: FollowStatus.ACCEPTED },
      relations: { following: true },
      select: {
        id: true,
        createdAt: true,
        following: {
          id: true,
          name: true,
          username: true,
          headline: true,
          profilePicture: true,
          isPrivate: true,
        },
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      following: items.map((item) => item.following),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPendingRequests(
    currentUserId: string,
    pagination: FollowPaginationDto,
  ) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [requests, total] = await this.followRepository.findAndCount({
      where: { followingId: currentUserId, status: FollowStatus.PENDING },
      relations: { follower: true },
      select: {
        id: true,
        createdAt: true,
        follower: {
          id: true,
          name: true,
          username: true,
          headline: true,
          profilePicture: true,
        },
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      requests,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSentRequests(
    currentUserId: string,
    pagination: FollowPaginationDto,
  ) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [requests, total] = await this.followRepository.findAndCount({
      where: { followerId: currentUserId, status: FollowStatus.PENDING },
      relations: { following: true },
      select: {
        id: true,
        createdAt: true,
        following: {
          id: true,
          name: true,
          username: true,
          headline: true,
          profilePicture: true,
        },
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      requests,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getFollowStatus(currentUserId: string, targetUserId: string) {
    const [outgoing, incoming] = await Promise.all([
      this.followRepository.findOne({
        where: { followerId: currentUserId, followingId: targetUserId },
      }),
      this.followRepository.findOne({
        where: { followerId: targetUserId, followingId: currentUserId },
      }),
    ]);

    return {
      isFollowing: outgoing?.status === FollowStatus.ACCEPTED,
      isFollower: incoming?.status === FollowStatus.ACCEPTED,
      hasPendingRequestFromMe: outgoing?.status === FollowStatus.PENDING,
      hasPendingRequestToMe: incoming?.status === FollowStatus.PENDING,
      outgoingStatus: outgoing?.status || null,
      incomingStatus: incoming?.status || null,
    };
  }
}
