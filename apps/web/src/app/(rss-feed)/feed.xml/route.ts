import RSS from 'rss';
import {
  feedDescription,
  feedTitle,
  xmlFeedRoute,
  feedCopyrightYearStart,
  feedCopyrightText,
  feedWebmaster,
} from '@pkg/common/config/sitemapAndFeeds';
import { copyrightYear } from '@pkg/utilities/copyright';
import { MINUTES_IN } from '@pkg/utilities/time';
import { getSanityDocumentsForFeed } from '@/features/sitemap-feeds/utilities/getSanityDocumentsForFeed';
import { urlFromPath, urlFromSanityPathname } from '@/utilities/makeUrl';

export const revalidate = MINUTES_IN.ONE_DAY;

export async function GET() {
  const feed = new RSS({
    title: feedTitle,
    description: feedDescription,
    site_url: urlFromPath('/'),
    feed_url: urlFromPath(xmlFeedRoute),
    copyright: `Copyright © ${copyrightYear(feedCopyrightYearStart)} ${feedCopyrightText}`,
    language: 'en',
    pubDate: new Date(),
    webMaster: feedWebmaster,
    ttl: MINUTES_IN.ONE_DAY,
  });

  const { data: posts } = await getSanityDocumentsForFeed();

  posts?.forEach((post) => {
    if (!post.title || !post.pathname || !post.published) {
      return;
    }

    feed.item({
      title: post.title,
      url: urlFromSanityPathname(post.pathname, post._type),
      date: post.published,
      description: post.excerpt ?? '',
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
}
