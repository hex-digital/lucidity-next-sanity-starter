import { defineQuery } from 'next-sanity';
import { PAGE_VISIBILITY } from '@pkg/sanity-toolkit/seo';
import type { DOCUMENT } from '@pkg/common/constants/schemaTypes';
import { DOCUMENTS_IN_RSS_FEED } from '@pkg/common/config/schemaTypes';
import { loadQuery } from '@/features/sanity/data/loadQuery.server';

type FeedPayload = Array<{
  _type: DOCUMENT;
  title?: string;
  published: string;
  pathname?: string;
  excerpt?: string;
}>;

export async function getSanityDocumentsForFeed() {
  const rssFeedDocTypeList = DOCUMENTS_IN_RSS_FEED.map((type) => `"${type}"`).join(',');
  const orderClause = `order(coalesce(updatedAt, publishedAt, _updatedAt, _createdAt) desc)`;

  return loadQuery<FeedPayload | null>(
    defineQuery(`
      *[_type in [${rssFeedDocTypeList}] && (!defined(pageVisibility) || pageVisibility == "${PAGE_VISIBILITY.PUBLIC}")] | ${orderClause} [0...300] {
        _type,
        title,
        'pathname': coalesce(pathname.current, slug.current),
        'published': coalesce(updatedAt, publishedAt, _updatedAt, _createdAt),
        excerpt,
      }
    `),
    {},
    {
      cache: 'force-cache',
      next: {
        tags: [`feed`, ...DOCUMENTS_IN_RSS_FEED],
      },
    },
  );
}
