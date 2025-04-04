// See: https://github.com/sanity-io/sanity/blob/next/packages/sanity/src/core/form/inputs/Slug/SlugInput.tsx
// Customised specifically at time of this commit: https://github.com/sanity-io/sanity/blob/d157fca17d146886413f86577258fb24ee35e3d2/packages/sanity/src/core/form/inputs/Slug/SlugInput.tsx

import { Box, Flex, Stack, TextInput } from '@sanity/ui';
import { useMemo } from 'react';
import type { FormEvent, ReactElement } from 'react';
import type { SuperSlugInputProps } from '../../types';

export function PathInput(
  props: Omit<SuperSlugInputProps, 'onChange'> & {
    apiVersion: string;
    onChange: (event: FormEvent<HTMLInputElement>) => void;
  },
): ReactElement {
  const { value, validation, readOnly, elementProps, onChange } = props;

  const errors = useMemo(
    () => validation.filter((item) => item.level === 'error'),
    [validation],
  );

  return (
    <Stack space={3}>
      <Flex gap={1}>
        <Box flex={1}>
          <TextInput
            customValidity={errors.length > 0 ? errors[0]?.message : ''}
            onChange={onChange}
            value={value?.current ?? ''}
            readOnly={readOnly}
            {...elementProps}
          />
        </Box>
      </Flex>
    </Stack>
  );
}
