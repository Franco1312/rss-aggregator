export class FeedSource {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly url: string,
    public readonly defaultCategory: string,
    public readonly isActive: boolean = true
  ) {}
}

