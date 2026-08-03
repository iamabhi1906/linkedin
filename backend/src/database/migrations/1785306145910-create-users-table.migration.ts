import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsersTable1785306145910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'authProvider',
            type: 'enum',
            enum: ['EMAIL', 'GOOGLE'],
          },
          {
            name: 'googleId',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'profilePicture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'coverPicture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'headline',
            type: 'varchar',
            length: '220',
            isNullable: true,
          },
          {
            name: 'about',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isVerified',
            type: 'boolean',
            default: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'SUSPENDED'],
            default: `'ACTIVE'`,
          },
          {
            name: 'lastLoginAt',
            type: 'timestamp',
            isNullable: true,
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

    await queryRunner.createIndices('users', [
      new TableIndex({
        name: 'IDX_USERS_USERNAME',
        columnNames: ['username'],
      }),
      new TableIndex({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
      }),
      new TableIndex({
        name: 'IDX_USERS_STATUS',
        columnNames: ['status'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
