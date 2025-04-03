import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey
} from "typeorm";

export class Profile1743694303646 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("profile", new TableColumn({
            name: "auth_id",
            type: "uuid"
        }))

        await queryRunner.createForeignKey(
            "profile",
            new TableForeignKey({
                name: "fk_profile_auth",
                columnNames: ["auth_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "auth",
                onDelete: "CASCADE"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("profile", "auth_id");
    }

}
