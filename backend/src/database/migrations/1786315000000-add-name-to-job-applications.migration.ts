import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameToJobApplications1786315000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_applications" ADD COLUMN IF NOT EXISTS "name" varchar(150)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "name"`,
    );
  }
}
