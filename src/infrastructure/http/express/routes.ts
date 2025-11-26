import { Router } from 'express';
import { NewsController } from '@/interfaces/controllers/NewsController';
import { validateQuery } from '@/infrastructure/validation/validator';
import { getNewsQuerySchema } from '@/infrastructure/validation/schemas';

export function createRoutes(newsController: NewsController): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  router.get(
    '/news',
    validateQuery(getNewsQuerySchema),
    (req, res) => {
      newsController.getNews(req, res).catch((error) => {
        console.error('Unhandled error in /news route:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
    }
  );

  router.get('/sources', (req, res) => {
    newsController.getSources(req, res).catch((error) => {
      console.error('Unhandled error in /sources route:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  });

  return router;
}

