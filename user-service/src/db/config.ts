import "dotenv/config"

import { DataSource } from "typeorm";

export const UsersDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "9432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: ["src/model/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
});