import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743496217838 implements MigrationInterface {
    name = 'Migration1743496217838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" citext NOT NULL, "last_name" citext NOT NULL, "email" citext NOT NULL, "password" text NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
