import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey
} from "typeorm";

export class UserAuthRelation1743694303646 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user", new TableColumn({
            name: "auth_id",
            type: "uuid"
        }))

        await queryRunner.createForeignKey(
            "user",
            new TableForeignKey({
                name: "fk_user_auth",
                columnNames: ["auth_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "auth",
                onDelete: "CASCADE"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "auth_id");
    }

}
