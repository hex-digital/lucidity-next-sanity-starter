import { type SlugValidationContext } from 'sanity';

interface Options {
  localeFieldname?: string;
}

export async function isUnique(
  slug: string,
  context: SlugValidationContext,
  opts?: Options,
): Promise<boolean> {
  const { document, getClient } = context;
  const options = {
    localeFieldname: 'locale',
    ...opts,
  };

  const client = getClient({ apiVersion: '2023-06-21' });

  const id = document?._id.replace(/^drafts\./, '');
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    [options.localeFieldname]: document?.[options.localeFieldname] ?? null,
  };

  const query = `*[!(_id in [$draft, $published]) && pathname.current == $slug && locale == $locale]`;
  const result = await client.fetch(query, params);

  return result.length === 0;
}
