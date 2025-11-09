import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import router from "src/router";
import swaggerSpec from "src/swagger";

const app: Express = express();

// Enable CORS for all routes
app.use(cors({
  origin: "*",
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/v1", router);

if (process.env.NODE_ENV !== "production") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

const port = process.env.PORT || 9004;

app.listen(port, () => {
  console.log(`Location Service is listening on port: ${port}`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`Swagger docs available at http://localhost:${port}/docs`);
  }
});
