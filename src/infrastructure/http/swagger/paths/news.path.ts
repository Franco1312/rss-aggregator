import { OpenAPIV3 } from 'openapi-types';

export const newsPath: OpenAPIV3.PathItemObject = {
  get: {
    summary: 'Get news articles',
    description: 'Retrieves news articles from aggregated RSS feeds with optional filtering and pagination',
    tags: ['News'],
    parameters: [
      {
        in: 'query',
        name: 'sourceId',
        schema: {
          type: 'string',
        },
        description: 'Filter news by RSS source ID (e.g., "clarin-economia")',
        example: 'clarin-economia',
      },
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

