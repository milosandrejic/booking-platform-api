import "reflect-metadata";
import express, { Express } from "express";
import "dotenv/config";
import { dataSource } from "src/db/config";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "src/swagger";
import router from "src/router";

dataSource.initialize();

const app: Express = express();

app.use(express.json());

app.use("/api/v1", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Booking Service is listening on port: ${port}`);
});
