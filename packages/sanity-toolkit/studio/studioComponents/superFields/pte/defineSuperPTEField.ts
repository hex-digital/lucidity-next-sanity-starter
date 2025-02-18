import type { SuperPTESchemaDefinition } from './types';
import { SuperPTEInput } from './SuperPTEInput';
import { defineField } from 'sanity';

export function defineSuperPTEField(schemaTypeDefinition: SuperPTESchemaDefinition) {
  return defineField({
    ...schemaTypeDefinition,
    // @ts-expect-error Typings don't seem to be right on the SuperPTEInput, but I can't figure out the exact right types.
    components: { input: SuperPTEInput },
  }) satisfies SuperPTESchemaDefinition;
}
