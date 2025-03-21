import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { defineNextMiddleware, fetchJson } from '@pkg/next-middleware/utilities';
import { redirectResolver } from '@pkg/sanity-toolkit/redirects';
import { type RedirectsQueryPayload } from '@pkg/sanity-toolkit/redirects/types';

/** Do not process the redirects middleware for all paths that start with any of these prefixes */
const skipPathPrefixes = ['/api'];
/** The path to the redirects API endpoint that retrieves the redirects from the CMS (as cannot cache this request in a Next middleware) */
const redirectsApiPath = '/api/redirects/cms';

export const cmsRedirects = defineNextMiddleware(async (request, response) => {
  const path = request.nextUrl.pathname;
  const query = request.nextUrl.searchParams;

  if (skipPathPrefixes.some((prefix) => path.startsWith(prefix))) {
    return response;
  }

  try {
    const redirect = await redirectResolver(path, query, getCmsRedirects(request));

    if (redirect) {
      return NextResponse.redirect(new URL(redirect.path, request.url), {
        status: redirect.code,
        headers: {
          'X-Redirected-From': request.nextUrl.toString(),
          'X-Redirected-By': 'Next CMS Redirects Middleware',
          'X-Redirects-Retrieved': redirect.retrievedOn,
        },
      });
    }
  } catch (error) {
    console.error('Unable to resolve CMS redirects. Skipping CMS redirects middleware', error);
  }
});

function getCmsRedirects(request: NextRequest) {
  return async function getCmsRedirectsFn() {
    const redirects = await fetchJson<RedirectsQueryPayload | null>(
      new URL(redirectsApiPath, request.nextUrl.origin),
    );

    return (
      redirects ?? {
        redirects: [],
        retrievedOn: new Date().toISOString(),
      }
    );
  };
}
