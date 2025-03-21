import { defineNextMiddleware } from '@pkg/next-middleware/utilities';

export const middlewareProcessed = defineNextMiddleware((_request, response) => {
  response.headers.set('X-Middleware-Processed', 'true');

  return response;
});
