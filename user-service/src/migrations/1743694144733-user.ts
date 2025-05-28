import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class User1743694144733 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "user",
      columns: [
        {
          name: "id",
          type: "uuid",
          isPrimary: true,
          generationStrategy: "uuid",
          default: "uuid_generate_v4()"
        },
        {
          name: "authId",
          type: "uuid",
          isNullable: false
        },
        {
          name: "firstName",
          type: "citext"
        },
        {
          name: "lastName",
          type: "citext"
        },
        {
          name: "displayName",
          type: "citext"
        },
        {
          name: "phoneNumber",
          type: "citext",
          isNullable: true
        },
        {
          name: "dateOfBirth",
          type: "timestamp without time zone",
          isNullable: true
        },
        {
          name: "nationality",
          type: "citext",
          isNullable: true
        },
        {
          name: "gender",
          type: "enum",
          enum: ["male", "female"],
          enumName: "genderEnum"
        }
      ]
    }));

    await queryRunner.createForeignKey(
      "user",
      new TableForeignKey({
        columnNames: ["authId"],
        referencedTableName: "auth",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user", true, true, true);
  }
}
