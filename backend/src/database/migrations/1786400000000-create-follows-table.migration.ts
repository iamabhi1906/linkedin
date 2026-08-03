import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateFollowsTable1786400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'follows',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'followerId',
            type: 'uuid',
          },
          {
            name: 'followingId',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
            default: `'PENDING'`,
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

    await queryRunner.createIndices('follows', [
      new TableIndex({
        name: 'IDX_FOLLOWS_FOLLOWER_FOLLOWING_UNIQUE',
        columnNames: ['followerId', 'followingId'],
        isUnique: true,
      }),
    ]);

    await queryRunner.createForeignKeys('follows', [
      new TableForeignKey({
        columnNames: ['followerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['followingId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('follows');
  }
}
