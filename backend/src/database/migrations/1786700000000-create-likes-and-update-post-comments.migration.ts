import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLikesAndUpdatePostComments1786700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_comments" ADD COLUMN IF NOT EXISTS "mediaUrl" varchar`,
    );

    await queryRunner.query(
      `ALTER TABLE "post_comments" ADD COLUMN IF NOT EXISTS "likesCount" integer NOT NULL DEFAULT 0`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "likes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "targetType" varchar(20) NOT NULL DEFAULT 'POST',
        "postId" uuid,
        "commentId" uuid,
        "userId" uuid NOT NULL,
        "reaction" varchar(50) NOT NULL DEFAULT 'like',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_likes_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_likes_post" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_likes_comment" FOREIGN KEY ("commentId") REFERENCES "post_comments"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_likes_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_likes_post_user_target" ON "likes" ("postId", "userId", "targetType")`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_likes_comment_user_target" ON "likes" ("commentId", "userId", "targetType")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_likes_comment_user_target"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_likes_post_user_target"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "likes"`);
    await queryRunner.query(`ALTER TABLE "post_comments" DROP COLUMN IF EXISTS "likesCount"`);
    await queryRunner.query(`ALTER TABLE "post_comments" DROP COLUMN IF EXISTS "mediaUrl"`);
  }
}
