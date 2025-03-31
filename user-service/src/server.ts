import express, { Express, Request, Response } from "express";
import "dotenv/config"
import "reflect-metadata";

import Profile from "@/model/profile"

const app: Express = express();
const port = process.env.PORT;

new Profile();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello!")
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`)
})
