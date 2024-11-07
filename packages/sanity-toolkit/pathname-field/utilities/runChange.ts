import { type FormPatch, PatchEvent, set, unset } from 'sanity';
import { getDocumentPath } from './urls';
import type { DocumentWithLocale, PathnameOptions } from '../types';
import type { PresentationNavigateContextValue } from '@sanity/presentation';
import { stringToPathname } from './stringToPathname';

export function runChange({
  document,
  onChange,
  value,
  i18nOptions,
  prevLocalizedPathname,
  preview,
  navigate,
}: {
  document: DocumentWithLocale;
  onChange: (patch: FormPatch | PatchEvent | FormPatch[]) => void;
  value?: string;
  i18nOptions?: PathnameOptions['i18n'];
  prevLocalizedPathname?: string;
  preview?: string | null;
  navigate?: PresentationNavigateContextValue;
}) {
  const finalValue = value ? stringToPathname(value, { allowTrailingSlash: true }) : undefined;

  onChange(
    value !== undefined
      ? set({
          current: finalValue,
          _type: 'slug',
        })
      : unset(),
  );

  if (navigate) {
    const newLocalizedPathname = getDocumentPath(
      {
        ...document,
        locale: i18nOptions?.enabled ? document.locale : undefined,
        pathname: finalValue,
      },
      i18nOptions?.defaultLocaleId || '',
      i18nOptions?.localizePathname,
    );

    if (preview === prevLocalizedPathname || !document._createdAt) {
      navigate(newLocalizedPathname);
    }
  }
}
