export class NewsItem {
  constructor(
    public readonly id: string,
    public readonly sourceId: string,
    public readonly sourceName: string,
    public readonly title: string,
    public readonly summary: string | null,
    public readonly link: string,
    public readonly publishedAt: Date | null,
    public readonly fetchedAt: Date,
    public readonly categories: string[],
    public readonly imageUrl: string | null
  ) {}
}

