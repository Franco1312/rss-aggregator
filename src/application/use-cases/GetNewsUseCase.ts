import { NewsItem } from '@/domain/entities/NewsItem';
import { InMemoryCache } from '@/infrastructure/cache/InMemoryCache';
import { logger } from '@/infrastructure/logger/PinoLogger';
import { LOG_EVENTS } from '@/infrastructure/logger/LOG_EVENTS';
import { FetchAndAggregateNewsUseCase } from './FetchAndAggregateNewsUseCase';

export interface GetNewsParams {
  sourceId?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export interface GetNewsResult {
  items: NewsItem[];
  total: number;
  limit: number;
  offset: number;
}

export class GetNewsUseCase {
  constructor(
    private readonly cache: InMemoryCache,
    private readonly fetchAndAggregateUseCase: FetchAndAggregateNewsUseCase
  ) {}

  async execute(params: GetNewsParams = {}): Promise<GetNewsResult> {
    const { sourceId, q, limit = 20, offset = 0 } = params;

    // Intentar obtener del caché
    let allNewsItems = this.cache.get<NewsItem[]>('news-all');

    // Si no hay caché válido, hacer fetch
    if (!allNewsItems) {
      logger.info({
        event: LOG_EVENTS.CACHE_MISS,
        msg: 'Cache miss, fetching news from RSS feeds',
      });
      allNewsItems = await this.fetchAndAggregateUseCase.execute();
    } else {
      logger.info({
        event: LOG_EVENTS.CACHE_HIT,
        msg: 'Cache hit, returning cached news',
      });
    }

    // Aplicar filtros
    let filteredItems = allNewsItems;

    if (sourceId) {
      filteredItems = filteredItems.filter((item) => item.sourceId === sourceId);
    }

    if (q) {
      const lowerQuery = q.toLowerCase();
      filteredItems = filteredItems.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const summaryMatch = item.summary?.toLowerCase().includes(lowerQuery) ?? false;
        return titleMatch || summaryMatch;
      });
    }

    const total = filteredItems.length;

    // Aplicar paginación
    const paginatedItems = filteredItems.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total,
      limit,
      offset,
    };
  }
}

