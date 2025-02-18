import { type ArrayOfObjectsInputProps, type SanityClient, useClient } from 'sanity';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PERSPECTIVE } from '../../studio/constants/perspectives';
import { formatConfigItemGroups } from '../utilities/formatConfigItemGroups';
import type { ConfigItem, ConfigItemGroupCallable, ConfigItemGroups } from '../types';
import { resolveWizardItems } from '../utilities/resolveWizardItems';

// @todo show error state
export function useItemGroups(
  configItemGroups: ConfigItemGroups,
  props: ArrayOfObjectsInputProps,
  {
    apiVersion = '2024-03-12',
  }: {
    apiVersion?: string;
  },
) {
  const [workingItemGroups, setWorkingItemGroups] = useState(() => configItemGroups);

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const clientWithoutConfig = useClient({ apiVersion });

  const client = useMemo(
    () => clientWithoutConfig.withConfig({ perspective: PERSPECTIVE.PUBLISHED }),
    [clientWithoutConfig],
  );

  const resolveCallableGroupItems = useCallback(
    async (configItemGroups: ConfigItemGroups) => {
      try {
        setLoading(true);

        const resolvedItemGroups = await resolveCallableItemGroups(configItemGroups, {
          client,
        });

        setWorkingItemGroups(resolvedItemGroups);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [configItemGroups, client],
  );

  useEffect(() => {
    void resolveCallableGroupItems(configItemGroups);
  }, [resolveCallableGroupItems, configItemGroups]);

  const itemGroups = useMemo(() => {
    return formatConfigItemGroups(resolveWizardItems(workingItemGroups, props));
  }, [workingItemGroups]);

  return {
    itemGroups,
  };
}

/**
 * Item Groups items can be a mix of static arrays, function callbacks, or special strings for certain generation functionality.
 * This function resolves the callable item groups.
 * The callable item groups return an array of items, or a promise that resolves to an array of items.
 * These are awaited so that we end up with a resolved array of items for each group that has a callable function.
 */
export async function resolveCallableItemGroups(
  configItemGroups: ConfigItemGroups,
  { client }: { client: SanityClient },
) {
  const callableItemGroups = configItemGroups.filter(
    (group): group is ConfigItemGroupCallable => typeof group.items === 'function',
  );

  /** Used to later track when all promises have settled */
  const callResults: Array<Array<ConfigItem> | Promise<void | Array<ConfigItem>>> = [];

  /** Map of objects with a promise and the corresponding itemGroup name that it belongs to */
  const trackedPromises = callableItemGroups.map((itemGroup) => {
    const promiseResults: { name: string; result: null | Array<ConfigItem> } = {
      name: itemGroup.name,
      result: null,
    };

    callResults.push(
      Promise.resolve(itemGroup.items({ client })) // Converts value so it's always a Promise
        .then((result) => (promiseResults.result = result)) // Stores the resolved result for later use
        // @todo better error handling
        .catch((err) => console.error(err)),
    );

    return promiseResults;
  });

  await Promise.allSettled(callResults);

  const resolvedItemGroups = configItemGroups.map((itemGroup) => {
    const resolvedGroup = trackedPromises.find((item) => item.name === itemGroup.name);

    // Not a callable item group, so just return original itemGroup
    if (!resolvedGroup) {
      return itemGroup;
    }

    // Problem resolving function or promise, so return an empty array
    if (!resolvedGroup?.result) {
      return {
        ...itemGroup,
        items: [],
      };
    }

    // Promise or function resolved, use the result as the group's items
    return {
      ...itemGroup,
      items: resolvedGroup.result,
    };
  });

  return resolvedItemGroups;
}
