import { Request, Response } from 'express';
import { GetNewsUseCase } from '@/application/use-cases/GetNewsUseCase';
import { NewsItemMapper } from '@/interfaces/mappers/NewsItemMapper';
import { logger } from '@/infrastructure/logger/PinoLogger';
import { LOG_EVENTS } from '@/infrastructure/logger/LOG_EVENTS';
import { GetNewsQuery } from '@/infrastructure/validation/schemas';

export class NewsController {
  constructor(private readonly getNewsUseCase: GetNewsUseCase) {}

  async getNews(req: Request, res: Response): Promise<void> {
    try {
      // Los query params ya están validados por el middleware
      const query = req.query as unknown as GetNewsQuery;

      const result = await this.getNewsUseCase.execute({
        sourceId: query.sourceId,
        q: query.q,
        limit: query.limit,
        offset: query.offset,
      });

      res.json({
        items: NewsItemMapper.toDtoArray(result.items),
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      });
    } catch (error) {
      logger.error({
        event: LOG_EVENTS.HTTP_ERROR,
        msg: 'Error in getNews controller',
        err: error,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getSources(_req: Request, res: Response): Promise<void> {
    try {
      const { rssSources } = await import('@/infrastructure/config/rss-sources');
      
      res.json({
        sources: rssSources.map((source) => ({
          id: source.id,
          name: source.name,
          url: source.url,
          defaultCategory: source.defaultCategory,
          isActive: source.isActive,
        })),
      });
    } catch (error) {
      logger.error({
        event: LOG_EVENTS.HTTP_ERROR,
        msg: 'Error in getSources controller',
        err: error,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

