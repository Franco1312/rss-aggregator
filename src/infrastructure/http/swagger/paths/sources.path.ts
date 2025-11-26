import { OpenAPIV3 } from 'openapi-types';

export const sourcesPath: OpenAPIV3.PathItemObject = {
  get: {
    summary: 'Get RSS sources',
    description: 'Returns the list of configured RSS sources',
    tags: ['Sources'],
    responses: {
      '200': {
        description: 'List of RSS sources',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SourcesResponse',
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

