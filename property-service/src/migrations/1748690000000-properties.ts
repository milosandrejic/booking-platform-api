import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Properties1748690000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "properties",
      columns: [
        {
          name: "id",
          type: "uuid",
          isPrimary: true,
          generationStrategy: "uuid",
          default: "uuid_generate_v4()"
        },
        {
          name: "ownerId",
          type: "uuid",
          isNullable: false
        },
        {
          name: "title",
          type: "citext",
          isNullable: false
        },
        {
          name: "description",
          type: "citext",
          isNullable: false
        },
        {
          name: "price",
          type: "float",
          isNullable: false
        },
        {
          name: "location",
          type: "geometry(Point,4326)",
          isNullable: false
        },
        {
          name: "addressLine",
          type: "citext",
          isNullable: false
        },
        {
          name: "city",
          type: "citext",
          isNullable: false
        },
        {
          name: "state",
          type: "citext",
          isNullable: false
        },
        {
          name: "postalCode",
          type: "citext",
          isNullable: false
        },
        {
          name: "country",
          type: "citext",
          isNullable: false
        },
        {
          name: "isActive",
          type: "boolean",
          isNullable: false,
          default: true
        },
        {
          name: "type",
          type: "citext",
          isNullable: false
        },
        {
          name: "facilities",
          type: "jsonb",
          isNullable: false,
          default: "'{}'"
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
    await queryRunner.dropTable("properties", true, true, true);
  }
}
