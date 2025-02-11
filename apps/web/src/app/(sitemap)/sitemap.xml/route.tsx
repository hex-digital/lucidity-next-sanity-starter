import { generateSitemap } from '@pkg/sanity-toolkit/sitemap-feeds/lib/generateSitemap';
import {
  DOCUMENTS_IN_SITEMAP,
  SITEMAP_XSL_URL,
} from '@/features/sitemap-feeds/sitemap-config';
import { sanityDocumentsToSitemapEntries } from '@/features/sitemap-feeds/utilities/sanityDocumentsToSitemapEntries';

export const revalidate = 86400; // 24 hours

export async function GET() {
  const sanitySitemapEntries = await sanityDocumentsToSitemapEntries(DOCUMENTS_IN_SITEMAP);

  const sitemap = generateSitemap(sanitySitemapEntries, { sitemapXslUrl: SITEMAP_XSL_URL });

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
