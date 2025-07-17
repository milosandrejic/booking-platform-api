import swaggerJSDoc from "swagger-jsdoc";

const port = process.env.PORT || 3001;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Property Service API",
      version: "1.0.0",
      description: "API documentation for the Property Service"
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Local server"
      }
    ]
  },
  apis: ["src/docs/*.ts", "src/controllers/*.ts", "src/model/*.ts"] // Add more files as needed
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
