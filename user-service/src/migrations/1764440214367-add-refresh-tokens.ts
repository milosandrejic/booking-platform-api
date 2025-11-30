import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRefreshTokens1764440214367 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add refreshToken column for storing hashed refresh tokens
    await queryRunner.addColumn("auth", new TableColumn({
      name: "refreshToken",
      type: "text",
      isNullable: true
    }));

    // Add refreshTokenExpiry column for token expiration
    await queryRunner.addColumn("auth", new TableColumn({
      name: "refreshTokenExpiry",
      type: "timestamp",
      isNullable: true
    }));

    // Add tokenVersion column for token revocation
    await queryRunner.addColumn("auth", new TableColumn({
      name: "tokenVersion",
      type: "integer",
      default: 0
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("auth", "tokenVersion");
    await queryRunner.dropColumn("auth", "refreshTokenExpiry");
    await queryRunner.dropColumn("auth", "refreshToken");
  }
}
