// See: https://github.com/sanity-io/sanity/blob/next/packages/sanity/src/core/form/inputs/Slug/SlugInput.tsx
// Customised specifically at time of this commit: https://github.com/sanity-io/sanity/blob/d157fca17d146886413f86577258fb24ee35e3d2/packages/sanity/src/core/form/inputs/Slug/SlugInput.tsx

import type { ComponentType } from 'react';
import type { SuperSlugInputProps } from '../types';
import styles from './styles.module.css';
import { SuperSlug } from './index';
import { useSuperSlugField } from '../hooks/useSuperSlugField';

/** @todo support users adding further jsx to component, such as more buttons, etc., and other customisations */

export function makeSuperSlugInput({ apiVersion }: { apiVersion: string }) {
  const SuperSlugInput: ComponentType<SuperSlugInputProps> = (props) => {
    const { value, schemaType } = props;
    const { prefix } = schemaType.options ?? {}; // @todo support function-defined, context-aware prefixes. Can then support document locale in prefix

    const fullPathname = `${prefix}${value?.current ?? ''}`;

    const superSlugField = useSuperSlugField({ ...props, apiVersion });

    return (
      <>
        <div className={styles.superSlugInput__preview}>
          <SuperSlug.FullUrlPreview fullPathname={fullPathname} />
        </div>

        <SuperSlug.PathInput
          {...props}
          apiVersion={apiVersion}
          onChange={(e) => superSlugField.updateSlug(e.currentTarget.value)}
        />
      </>
    );
  };

  return SuperSlugInput;
}
