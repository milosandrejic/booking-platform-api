import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class PropertyReview1748690100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "property_reviews",
      columns: [
        {
          name: "id",
          type: "uuid",
          isPrimary: true,
          generationStrategy: "uuid",
          default: "uuid_generate_v4()"
        },
        {
          name: "property_id",
          type: "uuid",
          isNullable: false
        },
        {
          name: "user_id",
          type: "uuid",
          isNullable: false
        },
        {
          name: "rating",
          type: "int",
          isNullable: false
        },
        {
          name: "comment",
          type: "citext",
          isNullable: false
        },
        {
          name: "created_at",
          type: "timestamp",
          default: "now()"
        },
        {
          name: "updated_at",
          type: "timestamp",
          default: "now()"
        }
      ]
    }));
    await queryRunner.createForeignKey(
      "property_reviews",
      new TableForeignKey({
        columnNames: ["property_id"],
        referencedTableName: "properties",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("property_reviews", true, true, true);
  }
}
