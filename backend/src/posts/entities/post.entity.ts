import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { PostVisibility } from '../enums/post-visibility.enum';
import { PostMedia } from '../../post-media/entities/post-media.entity';
import { PostLike } from '../../post-likes/entities/post-like.entity';
import { PostComment } from '../../post-comments/entities/post-comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  authorId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author!: User;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization?: Organization;

  @Column({ type: 'text' })
  content!: string;

  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
  })
  visibility!: PostVisibility;

  @Column({ type: 'int', default: 0 })
  likesCount!: number;

  @Column({ type: 'int', default: 0 })
  commentsCount!: number;

  @Column({ type: 'int', default: 0 })
  repostsCount!: number;

  @Column({ type: 'uuid', nullable: true })
  originalPostId?: string;

  @ManyToOne(() => Post, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'originalPostId' })
  originalPost?: Post;

  @OneToMany(() => PostMedia, (media) => media.post, { cascade: true })
  media!: PostMedia[];

  @OneToMany(() => PostLike, (like) => like.post)
  likes!: PostLike[];

  @OneToMany(() => PostComment, (comment) => comment.post)
  comments!: PostComment[];

  @Index()
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
