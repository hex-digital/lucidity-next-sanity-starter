// See: https://github.com/sanity-io/sanity/blob/next/packages/sanity/src/core/form/inputs/Slug/SlugInput.tsx
// Customised specifically at time of this commit: https://github.com/sanity-io/sanity/blob/d157fca17d146886413f86577258fb24ee35e3d2/packages/sanity/src/core/form/inputs/Slug/SlugInput.tsx

import { TextInput } from '@sanity/ui';
import { useMemo } from 'react';
import type { FormEvent, ReactElement } from 'react';
import type { SuperSlugInputProps } from '../../types';

export function PathInput(
  props: Omit<SuperSlugInputProps, 'onChange'> & {
    apiVersion: string;
    disabled?: boolean;
    onChange: (event: FormEvent<HTMLInputElement>) => void;
  },
): ReactElement {
  const { disabled, value, validation, readOnly, elementProps, onChange } = props;

  const errors = useMemo(
    () => validation.filter((item) => item.level === 'error'),
    [validation],
  );

  return (
    <TextInput
      customValidity={errors.length > 0 ? errors[0]?.message : ''}
      disabled={disabled}
      onChange={onChange}
      value={value?.current ?? ''}
      readOnly={readOnly}
      {...elementProps}
    />
  );
}
