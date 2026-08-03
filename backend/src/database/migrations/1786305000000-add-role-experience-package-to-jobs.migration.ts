import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleExperiencePackageToJobs1786305000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "role" varchar(150)`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "experienceNeeded" varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "packageOffered" varchar(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN IF EXISTS "packageOffered"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN IF EXISTS "experienceNeeded"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN IF EXISTS "role"`);
  }
}
