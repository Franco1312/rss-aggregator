import { NewsItem } from '@/domain/entities/NewsItem';
import { InMemoryCache } from '@/infrastructure/cache/InMemoryCache';
import { logger } from '@/infrastructure/logger/PinoLogger';
import { LOG_EVENTS } from '@/infrastructure/logger/LOG_EVENTS';
import { FetchAndAggregateNewsUseCase } from './FetchAndAggregateNewsUseCase';

export interface GetNewsParams {
  q?: string;
  fromDate?: Date;
  toDate?: Date;
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
    const { q, fromDate, toDate, limit = 20, offset = 0 } = params;

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

    // Filtrar por búsqueda de texto
    if (q) {
      const lowerQuery = q.toLowerCase();
      filteredItems = filteredItems.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const summaryMatch = item.summary?.toLowerCase().includes(lowerQuery) ?? false;
        return titleMatch || summaryMatch;
      });
    }

    // Filtrar por rango de fechas
    if (fromDate || toDate) {
      filteredItems = filteredItems.filter((item) => {
        const itemDate = item.publishedAt || item.fetchedAt;
        
        if (fromDate && itemDate < fromDate) {
          return false;
        }
        
        if (toDate && itemDate > toDate) {
          return false;
        }
        
        return true;
      });
    }

    // Ordenar por fecha (más recientes primero)
    filteredItems.sort((a, b) => {
      const dateA = a.publishedAt?.getTime() || a.fetchedAt.getTime();
      const dateB = b.publishedAt?.getTime() || b.fetchedAt.getTime();
      return dateB - dateA; // Descendente (más reciente primero)
    });

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

