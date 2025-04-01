import express, { Express, Request, Response } from "express";
import "dotenv/config"
import {dataSource} from "src/db/config"

const app: Express = express();

app.use(express.json())

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello!")
dataSource.initialize();
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`)
})
