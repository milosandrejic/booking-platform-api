import express, { Express } from "express";
import "dotenv/config";
import { dataSource } from "src/db/config";

import {
  router,
  internalRouter
} from "router";

dataSource.initialize();

const app: Express = express();

app.use(express.json());

app.use("/api/v1", router);
app.use("/api/internal", internalRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
