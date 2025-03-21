import { defineNextMiddleware } from '@pkg/next-middleware/utilities';

export const madeWithLucidity = defineNextMiddleware((_request, response) => {
  response.headers.set(
    'X-Made-With',
    'https://github.com/hex-digital/lucidity-next-sanity-starter',
  );

  return response;
});
