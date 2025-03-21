import type { NextRequest } from 'next/server';
import { runNextMiddlewarePipeline } from '@pkg/next-middleware/utilities';
import { madeWithLucidity } from './middleware/made-with-lucidity';
import { middlewareProcessed } from './middleware/middleware-processed';
import { cmsRedirects } from './middleware/cmsRedirects';

/** Add middleware to the pipeline here. They will be executed in the order they are listed here. */
const middlewarePipeline = [cmsRedirects, middlewareProcessed, madeWithLucidity];

/** See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher */
export const config = {
  // FYI Variables are ignored in this array as it's managed at build time by the compiler.
  matcher: [
    /*
     * Match all request paths except for:
     * - Static files (starting with _next/static)
     * - Image optimization files (starting with _next/image)
     * - Favicon file (favicon.ico file)
     * - .svg and .png images
     */
    '/((?!_next/static|_next/image|robots.txt|humans.txt|favicon.ico|apple-touch-icon*|.*\\.svg$|.*\\.png$|.*\\.css$|assets/.*).*)',
  ],
};

export function middleware(request: NextRequest) {
  return runNextMiddlewarePipeline(request, middlewarePipeline);
}
