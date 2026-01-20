import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import postRoutes from './routes/postRoute';
import commentRoutes from './routes/commentRoute';

const app = express();

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WebDevTask2 API',
      version: '1.0.0',
      description: 'WebDevTask2'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Dev server'
      }
    ],
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

export default app;
