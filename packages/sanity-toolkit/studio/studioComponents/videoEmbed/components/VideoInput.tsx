import { set, unset } from 'sanity';
import { type ChangeEvent, useCallback, useRef } from 'react';
import { Stack, TextInput } from '@sanity/ui';
import { getVideoDetails } from '../utilities/getVideoDetails';
import type { ObjectInputProps, ObjectSchemaType } from 'sanity';

export function VideoInput(props: ObjectInputProps<any, ObjectSchemaType>) {
  const { onChange, value = {} } = props;
  const latestUrlRef = useRef<string>('');

  const initialState = {
    ...value,
    shouldFetchThumbnail: value.shouldFetchThumbnail ?? true,
  };

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;
      latestUrlRef.current = nextValue;

      onChange(nextValue ? set(nextValue, ['url']) : unset());

      if (!nextValue) return;

      try {
        console.log('clicked');
        const details = await getVideoDetails(nextValue, value.shouldFetchThumbnail ?? true);
        console.log('details', details);

        if (latestUrlRef.current === nextValue) {
          onChange([
            set(details.id, ['id']),
            set(details.service, ['service']),
            set(details.embedUrl, ['embedUrl']),
            ...(details.thumbnailUrl ? [set(details.thumbnailUrl, ['thumbnailUrl'])] : []),
          ]);
        }
      } catch (error) {
        console.error('Failed to get video details:', error);
      }
    },
    [onChange, value.shouldFetchThumbnail],
  );

  return (
    <Stack space={2}>
      <TextInput value={value.url} onChange={handleChange} />
      <details>
        <summary>Debug Fields</summary>
        {props.renderDefault(props)}
      </details>
    </Stack>
  );
}
