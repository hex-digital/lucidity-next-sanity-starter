import 'server-only';

import * as queryStore from '@sanity/react-loader';
import { draftMode } from 'next/headers';

import { client } from './client';
import { appConfig } from '@/config/app';
import { PERSPECTIVE } from '@pkg/sanity-toolkit/studio/constants/perspectives';
import { SECONDS_IN } from '@pkg/utilities/time';
import type { ClientPerspective } from 'next-sanity';

const serverClient = client.withConfig({
  token: appConfig.sanity.readToken,
  // Enable stega if it's a Vercel preview deployment, as the Vercel Toolbar has controls that shows overlays
  stega: process.env.VERCEL_ENV === 'preview',
});

/**
 * Sets the server client for the query store, doing it here ensures that all data fetching in production
 * happens on the server and not on the client.
 * Live mode in `sanity/presentation` still works, as it uses the `useLiveMode` hook to update `useQuery`
 * instances with live draft content using `postMessage`.
 */
queryStore.setServerClient(serverClient);

const usingCdn = serverClient.config().useCdn;

function getCacheConfig(
  perspective: ClientPerspective,
  options: Parameters<typeof queryStore.loadQuery>[2] = {},
  usingCdn: boolean,
) {
  // If revalidate is 0, 'force-cache' has no effect (it won't cache the query)
  const cache =
    options.cache ?? (perspective === PERSPECTIVE.PREVIEW_DRAFTS ? 'no-cache' : 'force-cache');

  const revalidate = getRevalidate(usingCdn, options.next?.tags);

  const tags = [...(options.next?.tags ?? []), 'sanity'];

  if (cache === 'no-cache' || revalidate === 0) {
    console.log({ cache, revalidate, tags });
  }

  return { cache, revalidate, tags };
}

/**
 * Used to fetch data in Server Components.
 * It has built in support for handling Draft Mode and perspectives.
 *
 * The response is cached in the Next Data Cache
 * See: https://nextjs.org/docs/app/building-your-application/caching#request-memoization
 * See also: https://vercel.com/docs/infrastructure/data-cache
 * It will also be memoized within the same request, so we can call load or use
 * functions multiple times when required without duplicate network requests.
 *
 * When using the "published" perspective, time-based revalidation is used, set to match the
 * time-to-live on Sanity's API CDN (60 seconds) and will also fetch from the CDN.
 * When query sets `next.tags` and invalidation is set up we're not using the CDN, we will
 * cache indefinitely, as it can be invalidated.
 *
 * When using the "previewDrafts" perspective then the data is fetched from the live API and isn't cached,
 * and will also fetch draft content that isn't published yet.
 */
export const loadQuery = (async (query, params = {}, options = {}) => {
  const { isEnabled: isDraftMode } = await draftMode();

  const {
    stega, // optional override of stega to turn it off explicitly
    perspective = isDraftMode ? PERSPECTIVE.PREVIEW_DRAFTS : PERSPECTIVE.PUBLISHED,
  } = options;

  const { cache, revalidate, tags } = getCacheConfig(perspective, options, usingCdn);

  return queryStore.loadQuery(query, params, {
    ...options,
    cache,
    next: {
      revalidate,
      ...(options.next ?? {}),
      tags,
    },
    perspective,
    // Enable stega if in Draft Mode, to enable overlays when outside Sanity Studio
    stega: stega ?? isDraftMode,
  });
}) satisfies typeof queryStore.loadQuery;

/**
 * Get an appropriate revalidate interval based on application configuration and query options.
 */
function getRevalidate(
  usingCdn: boolean,
  tags?: Array<string>,
): NextFetchRequestConfig['revalidate'] {
  // If on the development site, don't cache at all (and ideally don't use the cdn either). This helps avoid update issues when testing.
  if (appConfig.debug.sanityNoCache) return 0;

  // If query sets `next.tags`, and we're not using the CDN (i.e. invalidation is set up), then it's safe to cache much longer.
  if (!usingCdn && Array.isArray(tags)) {
    return SECONDS_IN.ONE_WEEK;
  }

  // If not using revalidation then, if using CDN, set cache timer to same as CDN (60 seconds). Otherwise, do not cache.
  return usingCdn ? 60 : 0;
}
