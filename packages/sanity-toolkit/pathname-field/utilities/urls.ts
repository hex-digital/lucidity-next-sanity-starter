import type { DocForPath, LocalizePathnameFn } from '../types';

/**
 * Removes leading and trailing slashes from a string.
 */
export function stripMarginSlashes(path: string): string {
  return removeDoubleSlashes(path).replace(/^\/|\/$/g, '');
}

export function removeDoubleSlashes(path: string): string {
  return path.replace(/\/{2,}/g, '/');
}

export function getDocumentPath(
  doc: DocForPath,
  defaultLocaleId: string,
  localizePathnameFn?: LocalizePathnameFn,
): string | undefined {
  if (typeof doc.pathname !== 'string') return;

  const isDefault = doc.locale === defaultLocaleId;

  // Localize & format the final path
  return (localizePathnameFn || localizePathname)({
    pathname: doc.pathname,
    localeId: doc.locale,
    isDefault,
  });
}

export function localizePathname({
  pathname,
  localeId,
  isDefault,
}: {
  pathname: string;
  localeId?: string;
  isDefault?: boolean;
}) {
  if (!localeId || isDefault) {
    return formatPath(pathname);
  }

  return formatPath(`${localeId}${pathname}`);
}

export function formatPath(path: string): string {
  return `/${stripMarginSlashes(path)}`;
}
