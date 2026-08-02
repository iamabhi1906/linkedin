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
import { OrganizationType } from '../enums/organization-type.enum';
import { OrganizationMember } from './organization-member.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 100 })
  slug: string;

  @Column({ length: 220, nullable: true })
  tagline?: string;

  @Column({ type: 'text', nullable: true })
  about?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ length: 100, nullable: true })
  industry?: string;

  @Column({
    type: 'enum',
    enum: OrganizationType,
    default: OrganizationType.COMPANY,
  })
  organizationType: OrganizationType;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  cover?: string;

  @Column({ length: 150, nullable: true })
  location?: string;

  @Column({ length: 50, nullable: true })
  employeeCountRange?: string;

  @Column({ type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => OrganizationMember, (member) => member.organization)
  members: OrganizationMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
