import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Auth1746792986725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn("auth", new TableColumn({
      name: "access_token",
      type: "text",
      isNullable: true
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("auth", "access_token");
  }
}
