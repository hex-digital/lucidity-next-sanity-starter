import { definePathname } from '@pkg/sanity-toolkit/pathname-field/schema/definePathnameField';
import { type PathnameParams } from '@pkg/sanity-toolkit/pathname-field/types';
import { appConfig } from '@/config/app';

export function definePathnameField(schema: PathnameParams = {}) {
  return definePathname({
    ...schema,
    options: {
      prefix: appConfig.preview.domain,
      ...(schema.options ?? {}),
    },
  });
}
