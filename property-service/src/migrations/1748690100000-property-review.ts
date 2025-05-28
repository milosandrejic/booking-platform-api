import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class PropertyReview1748690100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "propertyReviews",
      columns: [
        {
          name: "id",
          type: "uuid",
          isPrimary: true,
          generationStrategy: "uuid",
          default: "uuid_generate_v4()"
        },
        {
          name: "propertyId",
          type: "uuid",
          isNullable: false
        },
        {
          name: "userId",
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
          name: "createdAt",
          type: "timestamp",
          default: "now()"
        },
        {
          name: "updatedAt",
          type: "timestamp",
          default: "now()"
        }
      ]
    }));
    await queryRunner.createForeignKey(
      "propertyReviews",
      new TableForeignKey({
        columnNames: ["propertyId"],
        referencedTableName: "properties",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("propertyReviews", true, true, true);
  }
}
