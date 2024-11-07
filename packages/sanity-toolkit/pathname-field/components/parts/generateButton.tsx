import React, { useCallback } from 'react';
import { Button, Spinner } from '@sanity/ui';
import { RefreshIcon } from '@sanity/icons';
import { useAsync } from '../../../studio/hooks/useAsync';
import { runChange, stringToPathname, getNewFromSource } from '../../utilities';
import { usePathnameContext } from '../../hooks';
import type { DocumentWithLocale, PathnameOptions, PathnameSourceFn } from '../../types';
import type { FormPatch, PatchEvent, Path } from 'sanity';
import type { PresentationNavigateContextValue } from '@sanity/presentation';

export function GenerateButton({
  sourceField,
  document,
  onChange,
  folder,
  disabled,
  localizedPathname,
  i18nOptions,
  preview,
  navigate,
}: {
  sourceField: string | Path | PathnameSourceFn;
  document: DocumentWithLocale;
  onChange: (patch: FormPatch | PatchEvent | FormPatch[]) => void;
  folder?: string;
  disabled?: boolean;
  localizedPathname?: string;
  i18nOptions?: PathnameOptions['i18n'];
  preview?: string | null;
  navigate?: PresentationNavigateContextValue;
}) {
  const pathnameContext = usePathnameContext();

  const updatePathname = useCallback(
    (nextPathname: string) => {
      const finalValue = [...(folder ? [folder] : []), stringToPathname(nextPathname)]
        .filter((part) => typeof part === 'string')
        .join('/');

      runChange({
        onChange,
        value: finalValue,
        document,
        i18nOptions,
        prevLocalizedPathname: localizedPathname,
        preview,
        navigate,
      });
    },
    [document, folder, i18nOptions, localizedPathname, navigate, onChange, preview],
  );

  const [generateState, handleGenerateSlug] = useAsync(() => {
    return getNewFromSource(sourceField, document, pathnameContext).then((newFromSource) =>
      updatePathname(
        stringToPathname(newFromSource?.trim() || '', {
          allowTrailingSlash: true,
        }),
      ),
    );
  }, [sourceField, pathnameContext, updatePathname]);

  const isUpdating = generateState?.status === 'pending';

  return (
    <Button
      fontSize={1}
      height="100%"
      mode="ghost"
      tone="default"
      icon={isUpdating ? Spinner : RefreshIcon}
      aria-label="Generate"
      onClick={handleGenerateSlug}
      disabled={disabled || isUpdating}
    />
  );
}
