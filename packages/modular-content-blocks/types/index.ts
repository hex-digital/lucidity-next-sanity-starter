import type { ONLY } from '../constants';

/**
 * The structure of Array Members for Modular Blocks.
 * This represents the structure of Modular Block fields, defined with Sanity's defineArrayMember()
 * helper function, that are passed to the `of` field of an `array` type field.
 */
export interface ModularBlockArrayMember {
  type: string;
  title?: string;
  name?: string;
}

export interface GetBlocksOptions {
  include?: Array<string>;
  exclude?: Array<string>;
  only?: ONLY;
}
