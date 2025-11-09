import swaggerJSDoc from "swagger-jsdoc";

const port = process.env.PORT || 9004;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Location Service API",
      version: "1.0.0",
      description: "API documentation for the Location Service - Geocoding and city autocomplete"
    },
    servers: [
      {
        url: "http://localhost:9000/api/v1/location",
        description: "API Gateway server"
      },
      {
        url: `http://localhost:${port}`,
        description: "Direct service server"
      }
    ]
  },
  apis: ["src/docs/*.ts", "src/controllers/*.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
