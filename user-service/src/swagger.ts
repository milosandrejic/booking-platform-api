import swaggerJSDoc from "swagger-jsdoc";

const port = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "API documentation for the User Service"
    },
    servers: [
      {
        url: "http://localhost:9000/api/v1/user",
        description: "API Gateway server"
      },
      {
        url: `http://localhost:${port}`,
        description: "Direct service server"
      }
    ]
  },
  apis: ["src/docs/*.ts", "src/controllers/*.ts", "src/model/*.ts"] // Add more files as needed
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
