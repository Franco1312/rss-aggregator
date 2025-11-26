import { NewsItem } from '@/domain/entities/NewsItem';
import { NewsRepository } from '@/domain/repositories/NewsRepository';
import { RssAggregator } from '@/infrastructure/rss/RssAggregator';
import { InMemoryCache } from '@/infrastructure/cache/InMemoryCache';
import { config } from '@/infrastructure/config/config';
import { logger } from '@/infrastructure/logger/PinoLogger';
import { LOG_EVENTS } from '@/infrastructure/logger/LOG_EVENTS';

export class FetchAndAggregateNewsUseCase {
  constructor(
    private readonly rssAggregator: RssAggregator,
    private readonly cache: InMemoryCache,
    private readonly newsRepository: NewsRepository
  ) {}

  async execute(): Promise<NewsItem[]> {
    logger.info({
      event: LOG_EVENTS.USE_CASE_EXECUTED,
      msg: 'Fetching and aggregating news from RSS feeds',
    });
    
    const newsItems = await this.rssAggregator.fetchAllSources();
    
    // Guardar en el repositorio
    await this.newsRepository.saveAll(newsItems);
    
    // Guardar en caché
    this.cache.set('news-all', newsItems, config.cacheTtlMs);
    
    logger.info({
      event: LOG_EVENTS.CACHE_SET,
      msg: 'Successfully fetched and cached news items',
      data: {
        itemsCount: newsItems.length,
      },
    });
    
    return newsItems;
  }
}

