import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateJobApplicationsTable1786310000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            name: 'jobId',
            type: 'uuid',
          },
          {
            name: 'applicantId',
            type: 'uuid',
          },
          {
            name: 'resumeUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'coverLetter',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '150',
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
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createIndices('job_applications', [
      new TableIndex({
        name: 'IDX_JOB_APPLICATIONS_UNIQUE',
        columnNames: ['jobId', 'applicantId'],
        isUnique: true,
      }),
    ]);

    await queryRunner.createForeignKeys('job_applications', [
      new TableForeignKey({
        columnNames: ['jobId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['applicantId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('job_applications');
  }
}
