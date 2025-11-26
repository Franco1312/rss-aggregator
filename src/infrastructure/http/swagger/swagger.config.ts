import { OpenAPIV3 } from 'openapi-types';
import { commonSchemas } from './schemas/common.schemas';
import { healthPath } from './paths/health.path';
import { newsPath } from './paths/news.path';
import { sourcesPath } from './paths/sources.path';

export const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'RSS Aggregator API',
    version: '1.0.0',
    description: 'API para agregar y consultar noticias económicas de Argentina desde múltiples fuentes RSS',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: process.env.SWAGGER_SERVER_URL || 'http://localhost:3000',
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'News',
      description: 'News aggregation and search endpoints',
    },
    {
      name: 'Sources',
      description: 'RSS sources management endpoints',
    },
  ],
  components: {
    schemas: commonSchemas,
  },
  paths: {
    '/health': healthPath,
    '/news': newsPath,
    '/sources': sourcesPath,
  },
};
