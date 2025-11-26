import { FeedSource } from '@/domain/entities/FeedSource';

export const rssSources: FeedSource[] = [
  new FeedSource(
    'clarin-economia',
    'Clarín - Economía',
    'https://www.clarin.com/rss/economia/',
    'economia',
    true
  ),
  new FeedSource(
    'ambito-economia',
    'Ámbito - Economía',
    'https://www.ambito.com/rss/pages/economia.xml',
    'economia',
    true
  ),
  new FeedSource(
    'ambito-finanzas',
    'Ámbito - Finanzas',
    'https://www.ambito.com/rss/pages/finanzas.xml',
    'finanzas',
    true
  ),
  new FeedSource(
    'perfil-economia',
    'Perfil - Economía',
    'https://www.perfil.com/feed/economia',
    'economia',
    true
  ),
];

