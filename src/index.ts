import { RssClient } from '@/infrastructure/rss/RssClient';
import { RssAggregator } from '@/infrastructure/rss/RssAggregator';
import { InMemoryCache } from '@/infrastructure/cache/InMemoryCache';
import { InMemoryNewsRepository } from '@/infrastructure/repositories/InMemoryNewsRepository';
import { FetchAndAggregateNewsUseCase } from '@/application/use-cases/FetchAndAggregateNewsUseCase';
import { GetNewsUseCase } from '@/application/use-cases/GetNewsUseCase';
import { NewsController } from '@/interfaces/controllers/NewsController';
import { createApp } from '@/infrastructure/http/express/app';
import { JobScheduler } from '@/infrastructure/scheduler/JobScheduler';
import { config } from '@/infrastructure/config/config';
import { rssSources } from '@/infrastructure/config/rss-sources';
import { logger } from '@/infrastructure/logger/PinoLogger';
import { LOG_EVENTS } from '@/infrastructure/logger/LOG_EVENTS';

async function bootstrap(): Promise<void> {
  logger.info({
    event: LOG_EVENTS.SERVER_STARTED,
    msg: 'Starting RSS Aggregator application...',
  });

  // Inicializar infraestructura
  const cache = new InMemoryCache();
  const rssClient = new RssClient();
  const rssAggregator = new RssAggregator(rssClient, rssSources);
  const newsRepository = new InMemoryNewsRepository();

  // Inicializar casos de uso
  const fetchAndAggregateUseCase = new FetchAndAggregateNewsUseCase(
    rssAggregator,
    cache,
    newsRepository
  );
  const getNewsUseCase = new GetNewsUseCase(
    cache,
    fetchAndAggregateUseCase
  );

  // Inicializar controlador
  const newsController = new NewsController(getNewsUseCase);

  // Crear aplicación Express
  const app = createApp(newsController);

  // Inicializar scheduler
  const scheduler = new JobScheduler(fetchAndAggregateUseCase);
  scheduler.start();

  // Manejar cierre graceful
  process.on('SIGTERM', () => {
    logger.info({
      event: LOG_EVENTS.SERVER_SHUTDOWN,
      msg: 'SIGTERM signal received: closing HTTP server',
    });
    scheduler.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info({
      event: LOG_EVENTS.SERVER_SHUTDOWN,
      msg: 'SIGINT signal received: closing HTTP server',
    });
    scheduler.stop();
    process.exit(0);
  });

  // Iniciar servidor
  app.listen(config.port, () => {
    logger.info({
      event: LOG_EVENTS.SERVER_STARTED,
      msg: 'Server is running',
      data: {
        port: config.port,
        environment: config.nodeEnv,
      },
    });
  });
}

bootstrap().catch((error) => {
  logger.error({
    event: LOG_EVENTS.SERVER_ERROR,
    msg: 'Failed to start application',
    err: error,
  });
  process.exit(1);
});

