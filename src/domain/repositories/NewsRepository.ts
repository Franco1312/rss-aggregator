import { NewsItem } from '@/domain/entities/NewsItem';

export interface NewsRepository {
  saveAll(newsItems: NewsItem[]): Promise<void>;
  findAll(): Promise<NewsItem[]>;
  findBySourceId(sourceId: string): Promise<NewsItem[]>;
  search(query: string): Promise<NewsItem[]>;
}

