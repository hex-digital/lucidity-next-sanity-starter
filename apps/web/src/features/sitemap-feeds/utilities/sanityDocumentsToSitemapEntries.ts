import { defineQuery } from 'next-sanity';
import type { DOCUMENT } from '@pkg/common/constants/schemaTypes';
import type { SitemapEntry } from '@pkg/sanity-toolkit/sitemap-feeds/types';
import { PAGE_VISIBILITY } from '@pkg/sanity-toolkit/seo';
import { DOCUMENTS_IN_SITEMAP } from '@pkg/common/config/schemaTypes';
import { loadQuery } from '@/features/sanity/data/loadQuery.server';
import { urlFromSanityPathname } from '@/utilities/makeUrl';

type SitemapPayload = Array<{
  _type: DOCUMENT;
  pathname?: string;
  lastModified?: string;
}>;

interface Options {
  filter?: string;
  pathnameField?: string;
  lastModifiedField?: string;
}

export async function sanityDocumentsToSitemapEntries(
  documentTypes: Array<DOCUMENT>,
  options: Options = {},
) {
  const { data: documents } = await getSanityDocumentsToIndex(documentTypes, options);

  return !documents ? [] : formatDocumentsForSitemap(documents);
}

function getSanityDocumentsToIndex(
  documentTypes: Array<DOCUMENT>,
  { filter, pathnameField, lastModifiedField }: Options = {},
) {
  const docTypesFilter = documentTypes.map((type) => `"${type}"`).join(',');

  const queryFilter =
    filter ??
    `*[
      _type in [${docTypesFilter}]
      && (
        !defined(pageVisibility) || pageVisibility == "${PAGE_VISIBILITY.PUBLIC}"
      )
    ]`;

  return loadQuery<SitemapPayload | null>(
    defineQuery(`${queryFilter} {
        _type,
        'pathname': ${pathnameField ?? 'coalesce(pathname.current, slug.current)'},
        'lastModified': ${lastModifiedField ?? 'coalesce(updatedAt, publishedAt, _updatedAt, _createdAt)'},
      }
    `),
    {},
    {
      cache: 'force-cache',
      next: {
        tags: [`sitemap`, ...DOCUMENTS_IN_SITEMAP],
      },
    },
  );
}

function formatDocumentsForSitemap(documents: SitemapPayload): Array<SitemapEntry> {
  return documents
    .filter((document) => document.pathname)
    .map((document) => ({
      // We use non-null-assertion (!) because Typescript doesn't work with .filter() yet, so doesn't know document.pathname is non-null
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      url: urlFromSanityPathname(document.pathname!, document._type),
      lastModified: document.lastModified,
    }));
}
