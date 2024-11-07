import * as PathUtils from '@sanity/util/paths';
import type { SanityDocument, SlugContext, PathnameSourceFn } from '../types';

export async function getNewFromSource(
  source: string | Path | PathnameSourceFn,
  document: SanityDocument,
  context: SlugContext,
): Promise<string | undefined> {
  return typeof source === 'function'
    ? source(document, context)
    : (PathUtils.get(document, source) as string | undefined);
}
