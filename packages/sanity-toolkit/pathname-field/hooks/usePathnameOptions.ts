import type { PathnameInputProps, PathnameOptions } from '../types';
import { usePathnamePrefix } from './usePathnamePrefix';
import { useMemo } from 'react';

export function usePathnameOptions(props: PathnameInputProps) {
  const fieldOptions = props.schemaType.options as PathnameOptions | undefined;
  const { prefix } = usePathnamePrefix(props);
  const folderOptions = fieldOptions?.folder ?? { canUnlock: true };
  const i18nOptions = useMemo(
    () =>
      fieldOptions?.i18n ?? {
        enabled: false,
        defaultLocaleId: undefined,
        localizePathname: undefined,
      },
    [fieldOptions],
  );
  const autoNavigate = fieldOptions?.autoNavigate ?? false;
  const sourceField = fieldOptions?.source;

  return { prefix, folderOptions, i18nOptions, autoNavigate, sourceField };
}
