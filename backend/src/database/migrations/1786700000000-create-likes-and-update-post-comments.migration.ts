import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateLikesAndUpdatePostComments1786700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('post_comments', 'mediaUrl'))) {
      await queryRunner.addColumn(
        'post_comments',
        new TableColumn({
          name: 'mediaUrl',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!(await queryRunner.hasColumn('post_comments', 'likesCount'))) {
      await queryRunner.addColumn(
        'post_comments',
        new TableColumn({
          name: 'likesCount',
          type: 'integer',
          default: 0,
        }),
      );
    }

    if (!(await queryRunner.hasTable('likes'))) {
      await queryRunner.createTable(
        new Table({
          name: 'likes',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'gen_random_uuid()',
            },
            {
              name: 'targetType',
              type: 'varchar',
              length: '20',
              default: "'POST'",
            },
            {
              name: 'postId',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'commentId',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'userId',
              type: 'uuid',
            },
            {
              name: 'reaction',
              type: 'varchar',
              length: '50',
              default: "'like'",
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
          ],
          foreignKeys: [
            new TableForeignKey({
              name: 'FK_likes_post',
              columnNames: ['postId'],
              referencedTableName: 'posts',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            }),
            new TableForeignKey({
              name: 'FK_likes_comment',
              columnNames: ['commentId'],
              referencedTableName: 'post_comments',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            }),
            new TableForeignKey({
              name: 'FK_likes_user',
              columnNames: ['userId'],
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            }),
          ],
          indices: [
            new TableIndex({
              name: 'IDX_likes_post_user_target',
              columnNames: ['postId', 'userId', 'targetType'],
            }),
            new TableIndex({
              name: 'IDX_likes_comment_user_target',
              columnNames: ['commentId', 'userId', 'targetType'],
            }),
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('likes')) {
      await queryRunner.dropTable('likes');
    }

    if (await queryRunner.hasColumn('post_comments', 'likesCount')) {
      await queryRunner.dropColumn('post_comments', 'likesCount');
    }

    if (await queryRunner.hasColumn('post_comments', 'mediaUrl')) {
      await queryRunner.dropColumn('post_comments', 'mediaUrl');
    }
  }
}
