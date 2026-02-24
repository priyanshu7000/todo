import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do API',
      version: '1.0.0',
      description: 'Production-ready To-Do application API',
    },
    servers: [
      {
        url: isProduction ? '/' : 'http://localhost:5000',
        description: isProduction ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: isProduction
    ? [path.join(__dirname, '../routes/*.js')]
    : ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
