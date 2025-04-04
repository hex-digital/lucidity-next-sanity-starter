import type { SuperSlugSchemaDefinition } from './types';
import { defineField } from 'sanity';
import { makeSuperSlugInput } from './components/SuperSlugInput';

export function defineSuperSlugField(
  schema: Partial<SuperSlugSchemaDefinition>,
  options: { apiVersion: string },
) {
  return defineField({
    ...schema,
    name: schema.name ?? 'pathname',
    title: schema.title ?? 'URL',
    type: 'slug',
    components: {
      ...schema.components,
      input: schema.components?.input ?? makeSuperSlugInput(options),
    },
  }) satisfies SuperSlugSchemaDefinition;
}
