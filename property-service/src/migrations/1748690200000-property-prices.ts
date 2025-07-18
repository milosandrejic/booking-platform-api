import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class PropertyPrices1748690200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "property_prices",
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
          type: "uuid"
        },
        {
          name: "basePricePerNight",
          type: "decimal",
          precision: 10,
          scale: 2
        },
        {
          name: "weekendPrice",
          type: "decimal",
          precision: 10,
          scale: 2,
          isNullable: true
        },
        {
          name: "cleaningFee",
          type: "decimal",
          precision: 10,
          scale: 2,
          default: 0
        },
        {
          name: "serviceFeePercent",
          type: "decimal",
          precision: 5,
          scale: 2,
          default: 0
        },
        {
          name: "currency",
          type: "varchar",
          length: "3",
          default: "'EUR'"
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
    }), true);

    // Create index on propertyId for faster lookups
    await queryRunner.createIndex("property_prices", new TableIndex({
      name: "IDX_PROPERTY_PRICES_PROPERTY_ID",
      columnNames: ["propertyId"]
    }));

    // Create foreign key constraint
    await queryRunner.createForeignKey("property_prices", new TableForeignKey({
      columnNames: ["propertyId"],
      referencedColumnNames: ["id"],
      referencedTableName: "properties",
      onDelete: "CASCADE"
    }));

    // Ensure only one pricing record per property
    await queryRunner.createIndex("property_prices", new TableIndex({
      name: "IDX_PROPERTY_PRICES_UNIQUE_PROPERTY",
      columnNames: ["propertyId"],
      isUnique: true
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("property_prices");
  }
}
