import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateJobsTable1786300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'location',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'job_type',
            type: 'enum',
            enum: [
              'FULL_TIME',
              'PART_TIME',
              'CONTRACT',
              'INTERNSHIP',
              'TEMPORARY',
            ],
            default: `'FULL_TIME'`,
          },
          {
            name: 'workplace_type',
            type: 'enum',
            enum: ['ON_SITE', 'HYBRID', 'REMOTE'],
            default: `'ON_SITE'`,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['DRAFT', 'OPEN', 'CLOSED'],
            default: `'OPEN'`,
          },
          {
            name: 'organization_id',
            type: 'uuid',
          },
          {
            name: 'posted_by_id',
            type: 'uuid',
          },
          {
            name: 'salary_range',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'applications_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'job_applications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'job_id',
            type: 'uuid',
          },
          {
            name: 'applicant_id',
            type: 'uuid',
          },
          {
            name: 'resume_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cover_letter',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'APPLIED',
              'IN_REVIEW',
              'SHORTLISTED',
              'REJECTED',
              'ACCEPTED',
            ],
            default: `'APPLIED'`,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndices('jobs', [
      new TableIndex({
        name: 'IDX_JOBS_ORG',
        columnNames: ['organization_id'],
      }),
      new TableIndex({
        name: 'IDX_JOBS_POSTED_BY',
        columnNames: ['posted_by_id'],
      }),
    ]);

    await queryRunner.createIndices('job_applications', [
      new TableIndex({
        name: 'IDX_JOB_APPLICATIONS_UNIQUE',
        columnNames: ['job_id', 'applicant_id'],
        isUnique: true,
      }),
    ]);

    await queryRunner.createForeignKeys('jobs', [
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['posted_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);

    await queryRunner.createForeignKeys('job_applications', [
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['applicant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('job_applications');
    await queryRunner.dropTable('jobs');
  }
}
