import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "@/package.json";
import { Express } from "express";
import { join } from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IMG BILECIK",
      version,
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "apikey", // Header'da aranacak anahtar
          description: "API key required for authentication",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [], // Tüm rotalarda ApiKeyAuth gerekliliğini etkinleştirir
      },
    ],
  },
  apis: ["../**/*.controller.ts"], // Annotasyon içeren dosyalar
};

const openapiSpecification = swaggerJSDoc(options);

export default openapiSpecification;
