import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthRenameClientToOwnerEnum1752742369631 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "roleEnum" RENAME VALUE 'CLIENT' TO 'OWNER';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "roleEnum" RENAME VALUE 'OWNER' TO 'CLIENT';
    `);
  }
}
