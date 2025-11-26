import { InMemoryCache } from './InMemoryCache';

describe('InMemoryCache', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  it('should store and retrieve a value', () => {
    cache.set('key1', 'value1', 1000);
    expect(cache.get<string>('key1')).toBe('value1');
  });

  it('should return null for non-existent key', () => {
    expect(cache.get('non-existent')).toBeNull();
  });

  it('should return null after TTL expires', (done) => {
    cache.set('key1', 'value1', 100);
    
    setTimeout(() => {
      expect(cache.get('key1')).toBeNull();
      done();
    }, 150);
  });

  it('should store and retrieve complex objects', () => {
    const obj = { name: 'test', count: 42 };
    cache.set('obj', obj, 1000);
    expect(cache.get<typeof obj>('obj')).toEqual(obj);
  });

  it('should clear all entries', () => {
    cache.set('key1', 'value1', 1000);
    cache.set('key2', 'value2', 1000);
    cache.clear();
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
  });

  it('should delete specific key', () => {
    cache.set('key1', 'value1', 1000);
    cache.set('key2', 'value2', 1000);
    cache.delete('key1');
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe('value2');
  });
});

