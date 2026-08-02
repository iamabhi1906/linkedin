import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('email-verification')
export class EmailVerification {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  email!: string;

  @Column()
  otpHash!: string;

  @Column()
  expiresAt!: Date;

  @Column({
    default: 0,
  })
  attempts!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
