import Parser from 'rss-parser';
import { FeedSource } from '@/domain/entities/FeedSource';
import { logger } from '@/infrastructure/logger/PinoLogger';
import { LOG_EVENTS } from '@/infrastructure/logger/LOG_EVENTS';

export interface RssItem {
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  categories?: string[];
  enclosure?: {
    url?: string;
    type?: string;
  };
  'media:content'?: {
    $?: {
      url?: string;
    };
  };
}

export class RssClient {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['media:content'],
      },
    });
  }

  async fetchFeed(feedSource: FeedSource): Promise<RssItem[]> {
    try {
      logger.info({
        event: LOG_EVENTS.RSS_FEED_FETCHED,
        msg: `Fetching RSS feed: ${feedSource.name}`,
        data: {
          sourceId: feedSource.id,
          url: feedSource.url,
        },
      });
      
      const feed = await this.parser.parseURL(feedSource.url);
      
      if (!feed.items || feed.items.length === 0) {
        logger.info({
          event: LOG_EVENTS.RSS_FEED_FETCHED,
          msg: `No items found in feed: ${feedSource.name}`,
          data: {
            sourceId: feedSource.id,
          },
        });
        return [];
      }

      return feed.items.map((item) => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet,
        content: item.content,
        categories: item.categories || [],
        enclosure: item.enclosure,
        'media:content': (item as unknown as { 'media:content'?: { $?: { url?: string } } })['media:content'],
      }));
    } catch (error) {
      logger.error({
        event: LOG_EVENTS.RSS_FEED_ERROR,
        msg: `Error fetching RSS feed: ${feedSource.name}`,
        data: {
          sourceId: feedSource.id,
          url: feedSource.url,
        },
        err: error,
      });
      return [];
    }
  }
}

