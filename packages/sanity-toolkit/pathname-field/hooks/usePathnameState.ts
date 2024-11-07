import type { SlugValue } from 'sanity';
import type { PathnameOptions } from '../types';
import { useState } from 'react';

export function usePathnameState(
  value: SlugValue | undefined,
  folderOptions: PathnameOptions['folder'],
  readOnly: boolean,
) {
  const segments = value?.current?.split('/').slice(0);
  const folder = segments?.slice(0, -1).join('/');
  const slug = segments?.slice(-1)[0] || '';
  const [folderLocked, setFolderLocked] = useState(!!folder);
  const folderCanUnlock = !readOnly && folderOptions?.canUnlock;

  return { folder, slug, folderLocked, setFolderLocked, folderCanUnlock };
}
