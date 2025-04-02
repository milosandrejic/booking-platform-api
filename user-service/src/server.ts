import express, { Express, Request, Response } from "express";
import "dotenv/config"
import { dataSource } from "src/db/config"

import router from "router";

dataSource.initialize();

const app: Express = express();

app.use(express.json())
app.use(router);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`)
});
