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
import { JobType } from '../enums/job-type.enum';
import { WorkplaceType } from '../enums/workplace-type.enum';
import { JobStatus } from '../enums/job-status.enum';
import { JobApplication } from '../../job-applications/entities/job-application.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 150 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ length: 150, nullable: true })
  role?: string;

  @Column({ length: 100, nullable: true })
  experienceNeeded?: string;

  @Column({ length: 100, nullable: true })
  packageOffered?: string;

  @Column({ length: 150, nullable: true })
  location?: string;

  @Column({
    type: 'enum',
    enum: JobType,
    default: JobType.FULL_TIME,
  })
  jobType!: JobType;

  @Column({
    type: 'enum',
    enum: WorkplaceType,
    default: WorkplaceType.ON_SITE,
  })
  workplaceType!: WorkplaceType;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.OPEN,
  })
  status!: JobStatus;

  @Column({ type: 'uuid' })
  organizationId!: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @Column({ type: 'uuid' })
  postedById!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postedById' })
  postedBy!: User;

  @Column({ length: 100, nullable: true })
  salaryRange?: string;

  @Column({ type: 'int', default: 0 })
  applicationsCount!: number;

  @OneToMany(() => JobApplication, (application) => application.job)
  applications!: JobApplication[];

  @Index()
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
