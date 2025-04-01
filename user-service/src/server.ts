import express, { Express, Request, Response } from "express";
import "dotenv/config"

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello!")
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`)
})
