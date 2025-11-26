import { InMemoryNewsRepository } from './InMemoryNewsRepository';
import { NewsItem } from '@/domain/entities/NewsItem';

describe('InMemoryNewsRepository', () => {
  let repository: InMemoryNewsRepository;

  beforeEach(() => {
    repository = new InMemoryNewsRepository();
  });

  const createMockNewsItem = (overrides?: Partial<NewsItem>): NewsItem => {
    return new NewsItem(
      overrides?.id || '1',
      overrides?.sourceId || 'test-source',
      overrides?.sourceName || 'Test Source',
      overrides?.title || 'Test Title',
      overrides?.summary || 'Test Summary',
      overrides?.link || 'https://test.com',
      overrides?.publishedAt || new Date(),
      overrides?.fetchedAt || new Date(),
      overrides?.categories || ['economia'],
      overrides?.imageUrl || null
    );
  };

  it('should save and retrieve all news items', async () => {
    const items = [
      createMockNewsItem({ id: '1', title: 'News 1' }),
      createMockNewsItem({ id: '2', title: 'News 2' }),
    ];

    await repository.saveAll(items);
    const result = await repository.findAll();

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('News 1');
    expect(result[1].title).toBe('News 2');
  });

  it('should filter by sourceId', async () => {
    const items = [
      createMockNewsItem({ id: '1', sourceId: 'source1' }),
      createMockNewsItem({ id: '2', sourceId: 'source2' }),
      createMockNewsItem({ id: '3', sourceId: 'source1' }),
    ];

    await repository.saveAll(items);
    const result = await repository.findBySourceId('source1');

    expect(result).toHaveLength(2);
    expect(result.every((item) => item.sourceId === 'source1')).toBe(true);
  });

  it('should search by query in title', async () => {
    const items = [
      createMockNewsItem({ id: '1', title: 'Economía Argentina' }),
      createMockNewsItem({ id: '2', title: 'Política Nacional' }),
      createMockNewsItem({ id: '3', title: 'Economía Mundial' }),
    ];

    await repository.saveAll(items);
    const result = await repository.search('Economía');

    expect(result).toHaveLength(2);
    expect(result.every((item) => item.title.includes('Economía'))).toBe(true);
  });

  it('should search by query in summary', async () => {
    const items = [
      createMockNewsItem({ id: '1', summary: 'Noticia sobre economía' }),
      createMockNewsItem({ id: '2', summary: 'Noticia sobre política' }),
    ];

    await repository.saveAll(items);
    const result = await repository.search('economía');

    expect(result).toHaveLength(1);
    expect(result[0].summary).toContain('economía');
  });

  it('should return empty array when no items match search', async () => {
    const items = [createMockNewsItem({ id: '1', title: 'Test' })];
    await repository.saveAll(items);
    const result = await repository.search('NonExistent');
    expect(result).toHaveLength(0);
  });
});

