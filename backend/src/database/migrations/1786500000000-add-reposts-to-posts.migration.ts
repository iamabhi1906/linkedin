import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddRepostsToPosts1786500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('posts', [
      new TableColumn({
        name: 'repostsCount',
        type: 'int',
        default: 0,
      }),
      new TableColumn({
        name: 'originalPostId',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        name: 'FK_posts_originalPostId',
        columnNames: ['originalPostId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('posts', 'FK_posts_originalPostId');
    await queryRunner.dropColumn('posts', 'originalPostId');
    await queryRunner.dropColumn('posts', 'repostsCount');
  }
}
