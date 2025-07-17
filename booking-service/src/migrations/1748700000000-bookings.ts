import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Bookings1748700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "bookings",
      columns: [
        {
          name: "id",
          type: "uuid",
          isPrimary: true,
          generationStrategy: "uuid",
          default: "uuid_generate_v4()"
        },
        {
          name: "userId",
          type: "uuid",
          isNullable: false
        },
        {
          name: "propertyId",
          type: "uuid",
          isNullable: false
        },
        {
          name: "startDate",
          type: "date",
          isNullable: false
        },
        {
          name: "endDate",
          type: "date",
          isNullable: false
        },
        {
          name: "totalPrice",
          type: "float",
          isNullable: false
        },
        {
          name: "status",
          type: "enum",
          enum: ["PENDING", "CONFIRMED", "CANCELLED"],
          enumName: "bookingStatusEnum",
          default: "'PENDING'"
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("bookings", true, true, true);
  }
}
