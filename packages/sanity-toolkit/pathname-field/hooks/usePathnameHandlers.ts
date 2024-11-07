import React, { useCallback } from 'react';
import { runChange, stringToPathname } from '../utilities';

export function usePathnameHandlers({
  onChange,
  document,
  i18nOptions,
  debouncedLocalizedPathname,
  preview,
  autoNavigate,
  debouncedNavigate,
  folder,
  setFolderLocked,
  fullPathInputRef,
}: any) {
  const updateFinalSegment = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const segment = stringToPathname(e.currentTarget.value);
      const finalValue = [folder, segment].filter(Boolean).join('/');

      runChange({
        onChange,
        value: finalValue,
        document,
        i18nOptions,
        prevLocalizedPathname: debouncedLocalizedPathname,
        preview,
        navigate: autoNavigate ? debouncedNavigate : undefined,
      });
    },
    [
      folder,
      onChange,
      document,
      i18nOptions,
      debouncedLocalizedPathname,
      preview,
      autoNavigate,
      debouncedNavigate,
    ],
  );

  const updateFullPath = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      runChange({
        onChange,
        value: e.currentTarget.value,
        document,
        i18nOptions,
        prevLocalizedPathname: debouncedLocalizedPathname,
        preview,
        navigate: autoNavigate ? debouncedNavigate : undefined,
      });
    },
    [
      onChange,
      document,
      i18nOptions,
      debouncedLocalizedPathname,
      preview,
      autoNavigate,
      debouncedNavigate,
    ],
  );

  const unlockFolder: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      setFolderLocked(false);
      requestAnimationFrame(() => fullPathInputRef.current?.focus());
    },
    [setFolderLocked, fullPathInputRef],
  );

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = useCallback(() => {
    setFolderLocked(!!folder);
  }, [folder, setFolderLocked]);

  return { updateFinalSegment, updateFullPath, unlockFolder, handleBlur };
}
