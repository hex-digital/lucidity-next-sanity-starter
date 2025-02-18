import { getDocumentUrlPrefix } from '@pkg/common/schema/getDocumentUrlPrefix';
import { appConfig } from '@/config/app';

/**
 * Create a fully qualified URL from a pathname and type, for accessing the document on the frontend.
 * This also automatically manages URLs where the full pathname may not be being stored in the CMS,
 * via the `getDocumentUrlPrefix` function.
 *
 * E.G.
 *   ```ts
 *   const url = urlFromSanityPathname('my-slug', 'article');
 *   // url is now 'https://www.atomos.co.uk/articles/my-slug'
 *   ```
 */
export function urlFromSanityPathname(pathname: string, type: string) {
  const path = getDocumentUrlPrefix(pathname, type);

  return urlFromPath(path);
}

/**
 * Create a fully qualified URL from a pathname, for accessing the document on the frontend.
 *
 * E.G.
 *   ```ts
 *   const url = urlFromPath('/articles/my-slug');
 *   // url is now 'https://www.atomos.co.uk/articles/my-slug'
 *   ```
 */
export function urlFromPath(path: string) {
  let slashlessPath = path.trim();

  if (slashlessPath.startsWith('/')) {
    slashlessPath = slashlessPath.slice(1);
  }

  if (slashlessPath.endsWith('/')) {
    slashlessPath = slashlessPath.slice(0, -1);
  }

  return `${appConfig.baseUrl}/${slashlessPath}`;
}
