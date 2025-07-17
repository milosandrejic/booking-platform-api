import swaggerJSDoc from "swagger-jsdoc";

const port = process.env.PORT || 9003;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booking Service API",
      version: "1.0.0",
      description: "API documentation for the Booking Service"
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Local server"
      }
    ]
  },
  apis: ["src/docs/*.ts", "src/controllers/*.ts", "src/model/*.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
