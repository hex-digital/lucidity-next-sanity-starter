import type { SlugSourceContext } from '@sanity/types';
import { useMemo } from 'react';

import { useClient, useCurrentUser, useDataset, useProjectId, useSchema } from 'sanity';

export type SlugContext = Omit<SlugSourceContext, 'parent' | 'parentPath'>;

export function useSlugContext(options: { apiVersion: string }): SlugContext {
  const client = useClient({ apiVersion: options.apiVersion });
  const schema = useSchema();
  const currentUser = useCurrentUser();
  const projectId = useProjectId();
  const dataset = useDataset();

  return useMemo(() => {
    return {
      getClient: () => client,
      projectId,
      dataset,
      schema,
      currentUser,
    };
  }, [client, schema, currentUser, projectId, dataset]);
}
