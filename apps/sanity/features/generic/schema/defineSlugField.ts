import { appConfig } from '@/config/app';
import type { SuperSlugSchemaDefinition } from '@pkg/sanity-toolkit/studio/studioComponents/superFields/slug/types';
import { defineSuperSlugField } from '@pkg/sanity-toolkit/studio/studioComponents/superFields/slug/defineSuperSlugField';

export function defineSlugField(schema: Partial<SuperSlugSchemaDefinition> = {}) {
  return defineSuperSlugField(
    {
      ...schema,
      description: 'Use "/" for homepage',
      options: {
        prefix: appConfig.preview.domain,
        ...(schema.options || {}),
      },
    },
    { apiVersion: appConfig.apiVersion },
  );
}
