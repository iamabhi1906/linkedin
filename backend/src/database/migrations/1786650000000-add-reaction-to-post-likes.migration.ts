import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddReactionToPostLikes1786650000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'post_likes',
      new TableColumn({
        name: 'reaction',
        type: 'varchar',
        length: '50',
        default: "'like'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('post_likes', 'reaction');
  }
}
