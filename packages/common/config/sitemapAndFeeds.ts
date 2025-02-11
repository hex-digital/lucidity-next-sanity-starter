export const xmlFeedRoute = '/feed.xml';
export const jsonFeedRoute = '/feed.json';

export const feedTitle = 'Lucidity Starter';
export const feedDescription = 'Articles and posts from the Lucidity Starter';

export const feedCopyrightYearStart = '2025';
export const feedCopyrightText = 'Lucidity. All Rights Reserved.';
export const feedWebmaster = 'https://www.hexdigital.com';

/**
 * When using Nextjs metadata, defined metadata (e.g. on layout + on a page) is shallow
 * merged. That means nested objects like `alternates` are overridden.
 *
 * Instead, we have to define them in a sharedMeta object (here), and then import them
 * everywhere they are used, so that the full base object is always given, and the object
 * is not overridden when adding new keys.
 */
export function sharedMeta(baseUrl: string) {
  return {
    alternates: {
      types: {
        'application/rss+xml': `${baseUrl}${xmlFeedRoute}`,
        'application/feed+json': `${baseUrl}${jsonFeedRoute}`,
      },
    },
  };
}
