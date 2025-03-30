import { defineArrayMember } from 'sanity';
import type { SchemaTypeDefinition } from 'sanity';
import type { GetBlocksOptions, ModularBlockArrayMember } from '../../types';
import { ONLY } from '../../constants';

export function getModularBlocksFn(
  innerOnlyBlocks: Array<SchemaTypeDefinition>,
  outerOnlyBlocks: Array<SchemaTypeDefinition>,
) {
  const allBlocks = [...innerOnlyBlocks, ...outerOnlyBlocks];

  /**
   * This function will provide a list of modular content blocks to be used in a sanity `array` field.
   * E.G.
   *   defineField({
   *     name: 'content',
   *     title: 'Modular Content',
   *     type: 'array',
   *     group: 'content',
   *     of: getModularBlocks(),
   *   }),
   *
   * It can optionally be filtered to include or exclude specific blocks, as well as only
   * including SECTION or INNER blocks.
   */
  function getModularBlocks(opts: GetBlocksOptions = {}) {
    const blocks = initialBlocks(opts);

    const include = opts.include ?? [];
    const exclude = opts.exclude ?? [];

    return blocks.reduce((acc, blockSchema) => {
      const isExcluded = !!exclude.length && exclude.includes(blockSchema.name);
      const isIncluded = !include.length || include.includes(blockSchema.name);

      if (!isExcluded && isIncluded) {
        acc.push(
          defineArrayMember({
            title: blockSchema.title ?? 'Unnamed block',
            name: blockSchema.name,
            type: blockSchema.name,
          }),
        );
      }

      return acc;
    }, [] as Array<ModularBlockArrayMember>);
  }

  function initialBlocks(opts: GetBlocksOptions = {}) {
    if (opts.only === ONLY.OUTER) {
      return outerOnlyBlocks;
    }
    if (opts.only === ONLY.INNER) {
      return innerOnlyBlocks;
    }

    return allBlocks;
  }

  return {
    getModularBlocks,
  };
}
