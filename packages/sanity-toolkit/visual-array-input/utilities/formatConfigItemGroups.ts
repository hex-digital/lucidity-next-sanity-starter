import type {
  ConfigItemGroupCallable,
  ConfigItemGroupNotCallable,
  ConfigItemWithoutVariants,
  ConfigItemWithVariants,
  ItemGroups,
} from '../types';

/**
 * Take an Item Groups Config object and format it so its standardised as an Item Groups for use.
 * This is because the Config object is a bit more relaxed:
 *  - It supports having no variants on an item, and putting the assetUrl and initialValue on the item itself
 *  - It supports defining just a name for an item or for a variant, and not needing a title
 */
export function formatConfigItemGroups(
  configItemGroups: Array<ConfigItemGroupNotCallable | ConfigItemGroupCallable>,
) {
  return configItemGroups.map((group) => {
    // If group.items is not an array, it's because it's currently being asynchronously transformed
    // from a function or promise within the useEffect. Therefore just accept an empty array for now.
    const items = Array.isArray(group.items) ? group.items : [];

    return {
      ...group,
      items: items
        /* Ensure all items have a variants array, as config doesn't require variants if there's only one */
        .map((item) => {
          if (hasVariants(item)) {
            return item;
          }

          const { assetUrl, itemsToAdd, ...restOfItem } = item;

          return {
            ...restOfItem,
            variants: [
              {
                variantTitle: item.title,
                variantAssetUrl: item.assetUrl,
                itemsToAdd: item.itemsToAdd,
              },
            ],
          };
        }),
    };
  }) satisfies ItemGroups;
}

function hasVariants(
  item: ConfigItemWithoutVariants | ConfigItemWithVariants,
): item is ConfigItemWithVariants {
  return (item as ConfigItemWithVariants).variants !== undefined;
}
