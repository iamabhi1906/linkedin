import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthProvider } from '../enums/auth-provider.enum';
import { UserStatus } from '../enums/user-status.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ length: 50 })
  username!: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  email!: string;

  @Column({ length: 150 })
  name!: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
  })
  authProvider!: AuthProvider;

  @Index({ unique: true })
  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  coverPicture?: string;

  @Column({
    length: 220,
    nullable: true,
  })
  headline?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  about?: string;

  @Column({
    length: 150,
    nullable: true,
  })
  location?: string;

  @Column({
    nullable: true,
  })
  website?: string;

  @Column({
    default: false,
  })
  isVerified!: boolean;

  @Column({
    default: false,
  })
  isPrivate!: boolean;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
