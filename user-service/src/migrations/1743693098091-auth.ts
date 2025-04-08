import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Auth1743693098091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "auth",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "email",
                    type: "citext"
                },
                {
                    name: "password",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "email_verified",
                    type: "boolean",
                    default: false
                },
                {
                    name: "role",
                    type: "enum",
                    enum: ["USER", "CLIENT", "ADMIN"],
                    enumName: "role_enum"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("auth", true, true, true)
    }


}
