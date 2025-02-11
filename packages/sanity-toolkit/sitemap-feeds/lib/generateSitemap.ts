import { type SitemapEntry } from '../types';

interface GenerateSitemapOptions {
  sitemapXslUrl?: string;
}

export function generateSitemap(
  entries: Array<SitemapEntry>,
  { sitemapXslUrl }: GenerateSitemapOptions = {},
) {
  return /* XML */ `
<?xml version="1.0" encoding="UTF-8"?>${sitemapXslUrl ? getXslStyleFile(sitemapXslUrl) : ''}
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${entries.map((entry) => `<url>${entryToXml(entry)}</url>`).join()}
</urlset>
<!-- XML Sitemap generated at ${new Date().toISOString()} -->
  `.trim();
}

function getXslStyleFile(path: string) {
  return `<?xml-stylesheet type="text/xsl" href="${path}"?>`;
}

function entryToXml(entry: SitemapEntry) {
  return /* XML */ `
<loc>${entry.url}</loc>
${entry.lastModified ? `<lastmod>${typeof entry.lastModified === 'string' ? entry.lastModified : entry.lastModified.toISOString()}</lastmod>` : ''}
${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  `.trim();
}
