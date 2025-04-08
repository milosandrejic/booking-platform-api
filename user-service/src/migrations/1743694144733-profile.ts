import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey
} from "typeorm";

export class Profile1743692313625 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "profile",
            columns: [
                {
                  name: "id",
                  type: "uuid",
                  isPrimary: true,
                  generationStrategy: "uuid",
                  default: "uuid_generate_v4()"
                },
                {
                    name: "first_name",
                    type: "citext"
                },
                {
                    name: "last_name",
                    type: "citext"
                },
                {
                    name: "display_name",
                    type: "citext"
                },
                {
                    name: "phone_number",
                    type: "citext",
                    isNullable: true
                },
                {
                    name: "date_of_birth",
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
                    enumName: "gender_enum"
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("profile", true, true, true)
    }

}
