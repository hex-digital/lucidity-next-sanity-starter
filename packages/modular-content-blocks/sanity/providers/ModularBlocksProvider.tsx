import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { ModularBlocksContext } from '../context/modularBlocksContext';

export const ModularBlocksProvider = ({
  children,
  overviewPreview,
}: {
  children: ReactNode;
  overviewPreview?: boolean;
}) => {
  const value = useMemo(
    () => ({
      state: { overviewPreview: overviewPreview ?? false },
    }),
    [overviewPreview],
  );

  return <ModularBlocksContext value={value}>{children}</ModularBlocksContext>;
};
