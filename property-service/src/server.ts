import express, { Express } from "express";
import "dotenv/config";
import { dataSource } from "src/db/config";
import swaggerUi from "swagger-ui-express";

import router from "router";
import swaggerSpec from "src/swagger";

dataSource.initialize();

const app: Express = express();

app.use(express.json());

app.use("/api/v1", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
