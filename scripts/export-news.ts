import * as fs from 'fs';
import * as path from 'path';
import { RssClient } from '../src/infrastructure/rss/RssClient';
import { RssAggregator } from '../src/infrastructure/rss/RssAggregator';
import { rssSources } from '../src/infrastructure/config/rss-sources';
import { NewsItemMapper } from '../src/interfaces/mappers/NewsItemMapper';

async function exportNews() {
  console.log('📰 Obteniendo noticias de RSS feeds...\n');

  const rssClient = new RssClient();
  const rssAggregator = new RssAggregator(rssClient, rssSources);

  try {
    const newsItems = await rssAggregator.fetchAllSources();
    
    console.log(`✅ Se obtuvieron ${newsItems.length} noticias\n`);

    // Convertir a DTOs para el JSON
    const newsDto = NewsItemMapper.toDtoArray(newsItems);

    // Guardar en archivo JSON
    const outputPath = path.join(__dirname, '..', 'news-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(newsDto, null, 2), 'utf-8');

    console.log(`💾 Noticias guardadas en: ${outputPath}`);
    console.log(`📊 Total de noticias: ${newsItems.length}`);
    console.log(`💾 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

    // Mostrar estadísticas por fuente
    const statsBySource = newsItems.reduce((acc, item) => {
      acc[item.sourceId] = (acc[item.sourceId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📈 Estadísticas por fuente:');
    Object.entries(statsBySource).forEach(([sourceId, count]) => {
      console.log(`   ${sourceId}: ${count} noticias`);
    });
  } catch (error) {
    console.error('❌ Error al exportar noticias:', error);
    process.exit(1);
  }
}

exportNews();

