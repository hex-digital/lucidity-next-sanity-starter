import { type ComponentType } from 'react';
import {
  defineField,
  type FieldDefinition,
  type ObjectFieldProps,
  type SlugValue,
} from 'sanity';

import { PathnameFieldComponent } from '../components/PathnameFieldComponent';
import { type PathnameParams } from '../types';
import { isUnique } from '../utilities/isUnique';

export function definePathname(
  schema: PathnameParams = { name: 'pathname' },
): FieldDefinition<'slug'> {
  const slugOptions = schema?.options;

  return defineField({
    ...schema,
    name: schema.name ?? 'pathname',
    title: schema?.title ?? 'URL',
    type: 'slug',
    components: {
      ...schema.components,
      field: (schema.components?.field ?? PathnameFieldComponent) as unknown as ComponentType<
        ObjectFieldProps<SlugValue>
      >,
    },
    options: {
      ...(slugOptions ?? {}),
      isUnique: slugOptions?.isUnique ?? isUnique,
    },
  });
}
