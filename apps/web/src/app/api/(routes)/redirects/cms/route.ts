import { NextResponse } from 'next/server';
import { type RedirectsQueryPayload } from '@pkg/sanity-toolkit/redirects/types';
import { REDIRECTS_QUERY } from '@pkg/sanity-toolkit/redirects/queries';
import { DOCUMENT } from '@pkg/common/constants/schemaTypes';
import { loadQuery } from '@/features/sanity/data/loadQuery.server';

export async function GET() {
  const cmsRedirects = await loadQuery<RedirectsQueryPayload | null>(
    REDIRECTS_QUERY(DOCUMENT.CONFIG_REDIRECT),
    {},
    {
      useCdn: true,
      cache: 'force-cache',
      next: {
        tags: [DOCUMENT.CONFIG_REDIRECT],
      },
    },
  );

  return NextResponse.json(cmsRedirects.data ?? {});
}
