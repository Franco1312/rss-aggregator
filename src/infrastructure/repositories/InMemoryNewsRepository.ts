import { NewsItem } from '@/domain/entities/NewsItem';
import { NewsRepository } from '@/domain/repositories/NewsRepository';

export class InMemoryNewsRepository implements NewsRepository {
  private newsItems: NewsItem[] = [];

  async saveAll(newsItems: NewsItem[]): Promise<void> {
    this.newsItems = [...newsItems];
  }

  async findAll(): Promise<NewsItem[]> {
    return [...this.newsItems];
  }

  async findBySourceId(sourceId: string): Promise<NewsItem[]> {
    return this.newsItems.filter((item) => item.sourceId === sourceId);
  }

  async search(query: string): Promise<NewsItem[]> {
    const lowerQuery = query.toLowerCase();
    return this.newsItems.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const summaryMatch = item.summary?.toLowerCase().includes(lowerQuery) ?? false;
      return titleMatch || summaryMatch;
    });
  }
}

