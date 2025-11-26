import { OpenAPIV3 } from 'openapi-types';

export const newsPath: OpenAPIV3.PathItemObject = {
  get: {
    summary: 'Get news articles',
    description: 'Retrieves news articles from aggregated RSS feeds. Results are ordered by date (most recent first) with optional filtering by date range, text search, and pagination.',
    tags: ['News'],
    parameters: [
      {
        in: 'query',
        name: 'q',
        schema: {
          type: 'string',
        },
        description: 'Search keyword to filter news by title or summary',
        example: 'bitcoin',
      },
      {
        in: 'query',
        name: 'fromDate',
        schema: {
          type: 'string',
          format: 'date-time',
        },
        description: 'Filter news published from this date (ISO 8601 format). Uses publishedAt or fetchedAt if publishedAt is not available.',
        example: '2024-01-01T00:00:00Z',
      },
      {
        in: 'query',
        name: 'toDate',
        schema: {
          type: 'string',
          format: 'date-time',
        },
        description: 'Filter news published until this date (ISO 8601 format). Uses publishedAt or fetchedAt if publishedAt is not available.',
        example: '2024-12-31T23:59:59Z',
      },
      {
        in: 'query',
        name: 'limit',
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 20,
        },
        description: 'Maximum number of news items to return',
        example: 20,
      },
      {
        in: 'query',
        name: 'offset',
        schema: {
          type: 'integer',
          minimum: 0,
          default: 0,
        },
        description: 'Number of items to skip for pagination',
        example: 0,
      },
    ],
    responses: {
      '200': {
        description: 'List of news articles',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/NewsResponse',
            },
          },
        },
      },
      '400': {
        description: 'Invalid query parameters',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
};

