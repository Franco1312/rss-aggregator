import { OpenAPIV3 } from 'openapi-types';

export const commonSchemas: Record<string, OpenAPIV3.SchemaObject> = {
  NewsItem: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'Unique identifier for the news item',
        example: 'clarin-economia-abc123',
      },
      sourceId: {
        type: 'string',
        description: 'ID of the RSS source',
        example: 'clarin-economia',
      },
      sourceName: {
        type: 'string',
        description: 'Name of the RSS source',
        example: 'Clarín - Economía',
      },
      title: {
        type: 'string',
        description: 'Title of the news article',
        example: 'Título de la noticia',
      },
      summary: {
        type: 'string',
        nullable: true,
        description: 'Summary or description of the news',
        example: 'Resumen de la noticia...',
      },
      link: {
        type: 'string',
        format: 'uri',
        description: 'URL to the original article',
        example: 'https://www.clarin.com/economia/...',
      },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        description: 'Publication date of the article',
        example: '2024-01-01T10:00:00.000Z',
      },
      fetchedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Date when the article was fetched',
        example: '2024-01-01T12:00:00.000Z',
      },
      categories: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Categories or tags associated with the news',
        example: ['economia'],
      },
      imageUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        description: 'URL to the article image',
        example: 'https://example.com/image.jpg',
      },
    },
    required: ['id', 'sourceId', 'sourceName', 'title', 'link', 'fetchedAt', 'categories'],
  },
  NewsResponse: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/NewsItem',
        },
      },
      total: {
        type: 'integer',
        description: 'Total number of news items matching the query',
        example: 120,
      },
      limit: {
        type: 'integer',
        description: 'Maximum number of items returned',
        example: 20,
      },
      offset: {
        type: 'integer',
        description: 'Number of items skipped',
        example: 0,
      },
    },
    required: ['items', 'total', 'limit', 'offset'],
  },
  HealthResponse: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'ok',
      },
      uptime: {
        type: 'number',
        description: 'Server uptime in seconds',
        example: 123.45,
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T12:00:00.000Z',
      },
    },
    required: ['status', 'uptime', 'timestamp'],
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        example: 'Internal server error',
      },
      details: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

