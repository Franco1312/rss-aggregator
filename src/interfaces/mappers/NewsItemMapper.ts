import { NewsItem } from '@/domain/entities/NewsItem';

export interface NewsItemDto {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  summary: string | null;
  link: string;
  publishedAt: string | null;
  fetchedAt: string;
  categories: string[];
  imageUrl: string | null;
}

export class NewsItemMapper {
  static toDto(newsItem: NewsItem): NewsItemDto {
    return {
      id: newsItem.id,
      sourceId: newsItem.sourceId,
      sourceName: newsItem.sourceName,
      title: newsItem.title,
      summary: newsItem.summary,
      link: newsItem.link,
      publishedAt: newsItem.publishedAt?.toISOString() || null,
      fetchedAt: newsItem.fetchedAt.toISOString(),
      categories: newsItem.categories,
      imageUrl: newsItem.imageUrl,
    };
  }

  static toDtoArray(newsItems: NewsItem[]): NewsItemDto[] {
    return newsItems.map((item) => this.toDto(item));
  }
}

