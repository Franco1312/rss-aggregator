import { createHash } from 'crypto';
import { NewsItem } from '@/domain/entities/NewsItem';
import { FeedSource } from '@/domain/entities/FeedSource';
import { RssClient, RssItem } from './RssClient';
import { logger } from '@/infrastructure/logger/PinoLogger';
import { LOG_EVENTS } from '@/infrastructure/logger/LOG_EVENTS';

export class RssAggregator {
  constructor(
    private readonly rssClient: RssClient,
    private readonly feedSources: FeedSource[]
  ) {}

  async fetchAllSources(): Promise<NewsItem[]> {
    const activeSources = this.getActiveSources();
    
    logger.info({
      event: LOG_EVENTS.RSS_FETCH_STARTED,
      msg: 'Fetching news from RSS sources',
      data: {
        activeSourcesCount: activeSources.length,
      },
    });

    const newsItems = await this.processAllSources(activeSources);
    const sortedItems = this.sortByDate(newsItems);

    logger.info({
      event: LOG_EVENTS.RSS_AGGREGATION_COMPLETED,
      msg: 'RSS aggregation completed',
      data: {
        totalItems: sortedItems.length,
      },
    });

    return sortedItems;
  }

  private getActiveSources(): FeedSource[] {
    return this.feedSources.filter((source) => source.isActive);
  }

  private async processAllSources(sources: FeedSource[]): Promise<NewsItem[]> {
    const allNewsItems: NewsItem[] = [];
    const seenLinks = new Set<string>();

    for (const source of sources) {
      const items = await this.processFeedSource(source, seenLinks);
      allNewsItems.push(...items);
    }

    return allNewsItems;
  }

  private async processFeedSource(
    source: FeedSource,
    seenLinks: Set<string>
  ): Promise<NewsItem[]> {
    try {
      const rssItems = await this.rssClient.fetchFeed(source);
      return this.processRssItems(rssItems, source, seenLinks);
    } catch (error) {
      logger.error({
        event: LOG_EVENTS.RSS_FETCH_ERROR,
        msg: `Error processing feed: ${source.name}`,
        data: {
          sourceId: source.id,
        },
        err: error,
      });
      return [];
    }
  }

  private processRssItems(
    rssItems: RssItem[],
    source: FeedSource,
    seenLinks: Set<string>
  ): NewsItem[] {
    const newsItems: NewsItem[] = [];

    for (const item of rssItems) {
      if (!this.isValidRssItem(item)) {
        continue;
      }

      if (this.isDuplicate(item.link, seenLinks)) {
        continue;
      }

      seenLinks.add(item.link);
      const newsItem = this.mapRssItemToNewsItem(item, source);
      newsItems.push(newsItem);
    }

    return newsItems;
  }

  private isValidRssItem(item: RssItem): boolean {
    return Boolean(item.link && item.title);
  }

  private isDuplicate(link: string, seenLinks: Set<string>): boolean {
    return seenLinks.has(link);
  }

  private mapRssItemToNewsItem(rssItem: RssItem, source: FeedSource): NewsItem {
    const id = this.generateId(source.id, rssItem.link);
    const publishedAt = this.parseDate(rssItem.pubDate);
    const fetchedAt = new Date();
    const imageUrl = this.extractImageUrl(rssItem);
    const categories = this.buildCategories(rssItem.categories, source.defaultCategory);
    const summary = this.extractSummary(rssItem);

    return new NewsItem(
      id,
      source.id,
      source.name,
      rssItem.title,
      summary,
      rssItem.link,
      publishedAt,
      fetchedAt,
      categories,
      imageUrl
    );
  }

  private parseDate(dateString?: string): Date | null {
    return dateString ? new Date(dateString) : null;
  }

  private extractImageUrl(rssItem: RssItem): string | null {
    if (this.hasImageEnclosure(rssItem.enclosure)) {
      return rssItem.enclosure!.url || null;
    }

    if (this.hasMediaContent(rssItem)) {
      return rssItem['media:content']?.$?.url || null;
    }

    return null;
  }

  private hasImageEnclosure(
    enclosure?: { url?: string; type?: string }
  ): boolean {
    return Boolean(
      enclosure?.url && enclosure.type?.startsWith('image/')
    );
  }

  private hasMediaContent(rssItem: RssItem): boolean {
    return Boolean(rssItem['media:content']?.$?.url);
  }

  private buildCategories(
    rssCategories: string[] | undefined,
    defaultCategory: string
  ): string[] {
    if (!rssCategories || rssCategories.length === 0) {
      return [defaultCategory];
    }

    return [...rssCategories, defaultCategory];
  }

  private extractSummary(rssItem: RssItem): string | null {
    if (rssItem.contentSnippet) {
      return rssItem.contentSnippet;
    }

    if (rssItem.content) {
      return rssItem.content.substring(0, 500);
    }

    return null;
  }

  private sortByDate(newsItems: NewsItem[]): NewsItem[] {
    return [...newsItems].sort((a, b) => {
      const dateA = this.getNewsItemDate(a);
      const dateB = this.getNewsItemDate(b);
      return dateB - dateA;
    });
  }

  private getNewsItemDate(newsItem: NewsItem): number {
    return newsItem.publishedAt?.getTime() || newsItem.fetchedAt.getTime();
  }

  private generateId(sourceId: string, link: string): string {
    const hash = createHash('md5').update(`${sourceId}-${link}`).digest('hex');
    return `${sourceId}-${hash.substring(0, 8)}`;
  }
}

