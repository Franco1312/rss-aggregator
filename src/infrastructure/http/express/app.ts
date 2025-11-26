import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { NewsController } from '@/interfaces/controllers/NewsController';
import { createRoutes } from './routes';
import { swaggerDocument } from '../swagger/swagger.config';

export function createApp(newsController: NewsController): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  const router = createRoutes(newsController);
  app.use(router);

  return app;
}

