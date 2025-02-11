import { feedDescription, feedTitle, jsonFeedRoute } from '@pkg/common/config/sitemapAndFeeds';
import { MINUTES_IN } from '@pkg/utilities/time';
import { getSanityDocumentsForFeed } from '@/features/sitemap-feeds/utilities/getSanityDocumentsForFeed';
import { appConfig } from '@/config/app';
import { urlFromPath, urlFromSanityPathname } from '@/utilities/makeUrl';

export const revalidate = MINUTES_IN.ONE_DAY;

export async function GET() {
  const { data: posts } = await getSanityDocumentsForFeed();

  const items = posts
    ?.map((post) => {
      if (!post.title || !post.pathname || !post.published) {
        return undefined;
      }

      const pageUrl = urlFromSanityPathname(post.pathname, post._type);

      return {
        id: pageUrl,
        title: post.title,
        url: pageUrl,
        date_published: post.published,
        content_text: post.excerpt ?? '',
        summary: post.excerpt ?? '',
      };
    })
    .filter(Boolean);

  return new Response(
    // See: https://www.jsonfeed.org/version/1.1/
    JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: feedTitle,
      description: feedDescription,
      home_page_url: appConfig.baseUrl,
      feed_url: urlFromPath(jsonFeedRoute),
      language: 'en',
      items,
    }),
    {
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
      },
    },
  );
}
