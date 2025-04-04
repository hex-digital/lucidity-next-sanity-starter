import type { SuperSlugInputProps } from '../types';
import { useCallback } from 'react';
import { PatchEvent, set, setIfMissing, unset } from 'sanity';
import { stringToSlug } from '../utilities';

export function useSuperSlugField(props: SuperSlugInputProps & { apiVersion: string }) {
  const { schemaType, onChange } = props;

  const options = schemaType.options;

  const slugifyFn = options?.slugifyFn ?? stringToSlug;

  const updateSlug = useCallback(
    (nextSlug: string) => {
      // We use stringToPathname to ensure that the value is a valid pathname.
      // We also allow trailing slashes to make it possible to create folders
      const finalNextSlug = nextSlug
        ? slugifyFn(nextSlug, { allowTrailingSlash: true })
        : undefined;

      const patch = finalNextSlug
        ? [setIfMissing({ _type: schemaType.name }), set(finalNextSlug, ['current'])]
        : unset([]);

      onChange(PatchEvent.from(patch));

      // @todo add auto-navigate if on Presentation screen
    },
    [onChange, schemaType.name, slugifyFn],
  );

  return {
    updateSlug,
  };
}
