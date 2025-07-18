import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class SeasonalPrices1748690300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "seasonal_prices",
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
          name: "startDate",
          type: "date"
        },
        {
          name: "endDate",
          type: "date"
        },
        {
          name: "pricePerNight",
          type: "decimal",
          precision: 10,
          scale: 2
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
    await queryRunner.createIndex("seasonal_prices", new TableIndex({
      name: "IDX_SEASONAL_PRICES_PROPERTY_ID",
      columnNames: ["propertyId"]
    }));

    // Create index on date range for faster date lookups
    await queryRunner.createIndex("seasonal_prices", new TableIndex({
      name: "IDX_SEASONAL_PRICES_DATE_RANGE",
      columnNames: ["startDate", "endDate"]
    }));

    // Create foreign key constraint
    await queryRunner.createForeignKey("seasonal_prices", new TableForeignKey({
      columnNames: ["propertyId"],
      referencedColumnNames: ["id"],
      referencedTableName: "properties",
      onDelete: "CASCADE"
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("seasonal_prices");
  }
}
