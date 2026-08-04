import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { PostComment } from '../../post-comments/entities/post-comment.entity';
import { User } from '../../users/entities/user.entity';

export enum LikeTargetType {
  POST = 'POST',
  COMMENT = 'COMMENT',
}

@Entity('likes')
@Index(['postId', 'userId', 'targetType'])
@Index(['commentId', 'userId', 'targetType'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20, default: LikeTargetType.POST })
  targetType!: LikeTargetType;

  @Column({ type: 'uuid', nullable: true })
  postId?: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'postId' })
  post?: Post;

  @Column({ type: 'uuid', nullable: true })
  commentId?: string;

  @ManyToOne(() => PostComment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'commentId' })
  comment?: PostComment;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar', length: 50, default: 'like' })
  reaction!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
