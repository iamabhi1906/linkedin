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
export class FollowRequestService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendFollowRequest(
    followerId: string,
    targetUserId: string,
  ): Promise<{ follow: Follow; message: string }> {
    if (followerId === targetUserId) {
      throw new BadRequestException(
        'You cannot send a follow request to yourself',
      );
    }

    const targetUser = await this.userRepository.findOneBy({
      id: targetUserId,
    });
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    let follow = await this.followRepository.findOne({
      where: { followerId, followingId: targetUserId },
    });

    const isPublic = !targetUser.isPrivate;
    const targetStatus = isPublic
      ? FollowStatus.ACCEPTED
      : FollowStatus.PENDING;
    if (follow) {
      if (follow.status === FollowStatus.ACCEPTED) {
        throw new ConflictException('You are already following this user');
      }
      if (follow.status === FollowStatus.PENDING) {
        throw new ConflictException('Follow request is already pending');
      }
      follow.status = targetStatus;
    } else {
      follow = this.followRepository.create({
        followerId,
        followingId: targetUserId,
        status: targetStatus,
      });
    }
    const savedFollow = await this.followRepository.save(follow);
    const message = isPublic
      ? 'You are now following this user'
      : 'Follow request sent successfully';

    return { follow: savedFollow, message };
  }

  async acceptFollowRequest(
    currentUserId: string,
    identifier: string,
  ): Promise<Follow> {
    const follow = await this.followRepository
      .createQueryBuilder('follow')
      .where('follow.followingId = :currentUserId', { currentUserId })
      .andWhere('follow.status = :status', { status: FollowStatus.PENDING })
      .andWhere(
        '(follow.id = :identifier OR follow.followerId = :identifier)',
        {
          identifier,
        },
      )
      .getOne();

    if (!follow) {
      throw new NotFoundException('Pending follow request not found');
    }

    follow.status = FollowStatus.ACCEPTED;
    return await this.followRepository.save(follow);
  }

  async rejectFollowRequest(
    currentUserId: string,
    identifier: string,
  ): Promise<Follow> {
    const follow = await this.followRepository
      .createQueryBuilder('follow')
      .where('follow.followingId = :currentUserId', { currentUserId })
      .andWhere('follow.status = :status', { status: FollowStatus.PENDING })
      .andWhere(
        '(follow.id = :identifier OR follow.followerId = :identifier)',
        {
          identifier,
        },
      )
      .getOne();

    if (!follow) {
      throw new NotFoundException('Pending follow request not found');
    }

    follow.status = FollowStatus.REJECTED;
    return await this.followRepository.save(follow);
  }

  async cancelSentRequest(
    followerId: string,
    identifier: string,
  ): Promise<void> {
    const follow = await this.followRepository
      .createQueryBuilder('follow')
      .where('follow.followerId = :followerId', { followerId })
      .andWhere('follow.status = :status', { status: FollowStatus.PENDING })
      .andWhere(
        '(follow.id = :identifier OR follow.followingId = :identifier)',
        {
          identifier,
        },
      )
      .getOne();

    if (!follow) {
      throw new NotFoundException('Pending follow request not found');
    }

    await this.followRepository.remove(follow);
  }
}
