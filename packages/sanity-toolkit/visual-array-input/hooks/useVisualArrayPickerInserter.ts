import { useCallback } from 'react';
import type { ArrayOfObjectsInputProps, Path } from 'sanity';
import { populateDefaultFieldValues } from '../../studio/utilities/populateDefaultFieldValues';
import { generateItemKey } from '../../studio/utilities/strings';
import type { AddItemCallbackFn, OnItemAddFn } from '../types';

interface Props {
  props: ArrayOfObjectsInputProps;
}

export function useVisualArrayPickerInserter({ props }: Readonly<Props>) {
  /**
   * This function adds the actual items. We may add one or more items at a time
   *
   * Certain fields need to be populated when using the functions provided by props.
   * This is handled by the populateDefaultFieldValues function.
   * Without this some fields—such as arrays—would default to no value, which causes an
   * error in Sanity. They have to be initialised to an empty array.
   *
   * We then also merge in any initialValues defined for the item afterward, as well
   * as generating a key for the item, so it's ready to be inserted.
   *
   * It might be better to do this using a Sanity Client call, instead of these internal
   * functions, as these functions seemingly internal. Would be good to get some
   * thoughts from Sanity here.
   */
  const addItemsToArray: AddItemCallbackFn = useCallback(
    (items, index = -1) => {
      const itemsToAdd = Array.isArray(items) ? items : [items];

      const isSingleItem = itemsToAdd.length === 1;

      let mutableIndex = 1;

      itemsToAdd.forEach((item) => {
        const { type, initialValue } = item;

        const defaultSanityFieldValues = populateDefaultFieldValues(type, props);

        const newItem = {
          _type: type,
          ...defaultSanityFieldValues,
          ...(initialValue ?? {}),
          _key: generateItemKey(),
        };

        if (index === -1) {
          props.onItemAppend(newItem);
        } else if (index === 0) {
          props.onItemPrepend(newItem);
        } else {
          props.onInsert({
            items: [newItem],
            position: 'after',
            referenceItem: mutableIndex - 1,
            open: isSingleItem,
          });

          mutableIndex = mutableIndex + 1;
        }
      });
    },
    [props],
  );

  /** itemsToAdd can be a function, an array of objects or a single object, so this function helps us handle all cases appropriately */
  const addItems: OnItemAddFn = useCallback(
    ({ itemsToAdd }) => {
      if (typeof itemsToAdd === 'function') {
        itemsToAdd({ index: -1, inputProps: props, addItems: addItemsToArray });
        return;
      }

      addItemsToArray(itemsToAdd, -1);
    },
    [addItemsToArray, props],
  );

  return {
    addItems,
  };
}
