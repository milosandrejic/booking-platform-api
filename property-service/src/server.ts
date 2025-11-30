import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
import { dataSource } from "src/db/config";
import swaggerUi from "swagger-ui-express";

import router, { internalRouter } from "src/router";
import swaggerSpec from "src/swagger";

dataSource.initialize();

const app: Express = express();

// Enable CORS for all routes
app.use(cors({
  origin: ["http://localhost:8001", "http://localhost:8002", "http://localhost:8003"],
  credentials: true,
  preflightContinue: false
}));

app.use(express.json());

app.use("/api/v1", router);
app.use("/api/internal", internalRouter);

if (process.env.NODE_ENV !== "production") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Property Service is listening on port: ${port}`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`Swagger docs available at http://localhost:${port}/docs`);
  }
});
