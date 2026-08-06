import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FollowStatusEnum1786001843113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'follows',
      'status',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'UNFOLLOW'],
        default: `'PENDING'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'follows',
      'status',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: `'PENDING'`,
      }),
    );
  }
}
