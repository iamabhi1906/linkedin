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
            name: 'role',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'experienceNeeded',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'packageOffered',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'jobType',
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
            name: 'workplaceType',
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
            name: 'organizationId',
            type: 'uuid',
          },
          {
            name: 'postedById',
            type: 'uuid',
          },
          {
            name: 'salaryRange',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'applicationsCount',
            type: 'int',
            default: 0,
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
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndices('jobs', [
      new TableIndex({
        name: 'IDX_JOBS_ORG',
        columnNames: ['organizationId'],
      }),
      new TableIndex({
        name: 'IDX_JOBS_POSTED_BY',
        columnNames: ['postedById'],
      }),
    ]);

    await queryRunner.createForeignKeys('jobs', [
      new TableForeignKey({
        columnNames: ['organizationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['postedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jobs');
  }
}
