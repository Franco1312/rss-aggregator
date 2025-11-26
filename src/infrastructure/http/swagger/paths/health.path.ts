import { OpenAPIV3 } from 'openapi-types';

export const healthPath: OpenAPIV3.PathItemObject = {
  get: {
    summary: 'Health check endpoint',
    description: 'Returns the health status of the server',
    tags: ['Health'],
    responses: {
      '200': {
        description: 'Server is healthy',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/HealthResponse',
            },
          },
        },
      },
    },
  },
};

