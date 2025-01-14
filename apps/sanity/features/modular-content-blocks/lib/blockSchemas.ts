import { type SchemaTypeDefinition } from 'sanity';
import {
  innerBlocksSchema,
  outerBlocksSchema,
} from '@/features/modular-content-blocks/lib/blockSchemaGenerated';

export const outerOnlyBlocks = Object.values(outerBlocksSchema)
  .map((block) => block.schema)
  .filter(Boolean);

export const innerOnlyBlocks = Object.values(innerBlocksSchema)
  .map((block) => block.schema)
  .filter(Boolean);

/**
 * The object schema to register with Sanity. This allows us to use our blocks as "type"s when
 * defining fields or array members.
 */
export const blocksObjectSchema: Array<SchemaTypeDefinition> = [
  ...outerOnlyBlocks,
  ...innerOnlyBlocks,
];
