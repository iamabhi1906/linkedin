import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';
import { FollowStatus } from '../enums/follow-status.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async directFollow(
    followerId: string,
    targetUserId: string,
  ): Promise<Follow> {
    if (followerId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const targetUser = await this.userRepository.findOneBy({
      id: targetUserId,
    });
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    if (targetUser.isPrivate) {
      throw new BadRequestException(
        'User profile is private. Please send a follow request.',
      );
    }

    let follow = await this.followRepository.findOne({
      where: { followerId, followingId: targetUserId },
    });

    if (follow) {
      if (follow.status === FollowStatus.ACCEPTED) {
        throw new ConflictException('You are already following this user');
      }
      follow.status = FollowStatus.ACCEPTED;
    } else {
      follow = this.followRepository.create({
        followerId,
        followingId: targetUserId,
        status: FollowStatus.ACCEPTED,
      });
    }

    return await this.followRepository.save(follow);
  }

  async unfollow(followerId: string, targetUserId: string): Promise<void> {
    if (followerId === targetUserId)
      throw new BadRequestException('You cannot unfollow yourself');

    const follow = await this.followRepository.findOne({
      where: { followerId, followingId: targetUserId },
    });
    if (!follow || follow.status !== FollowStatus.ACCEPTED)
      throw new NotFoundException('You are not following this user');

    await this.followRepository.remove(follow);
  }

  async removeFollower(followingId: string, followerId: string): Promise<void> {
    if (followingId === followerId) {
      throw new BadRequestException('Invalid request');
    }

    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (!follow || follow.status !== FollowStatus.ACCEPTED) {
      throw new NotFoundException('User is not following you');
    }

    await this.followRepository.remove(follow);
  }
}
