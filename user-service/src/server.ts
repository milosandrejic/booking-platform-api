import express, { Express, Request, Response } from "express";
import "dotenv/config"
import {dataSource} from "src/db/config"

const app: Express = express();

app.use(express.json())

const port = process.env.PORT;

dataSource.initialize();

app.get("/", async (req: Request, res: Response) => {
  res.send("Helloo!!!")
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`)
})
