import { useCallback } from 'react';
import { useGetFormValue, useTranslation } from 'sanity';
import type { SlugParent, SlugSourceContext, Path, SanityDocument } from 'sanity';
import * as PathUtils from '@sanity/util/paths';
import type { SlugContext, SlugSourceFn, SuperSlugInputProps } from '../types';
import { useAsync } from '../../../../../hooks/useAsync';
import { useSlugContext } from './useSlugContext';

interface UseSlugGeneratorProps {
  apiVersion: string;
  sourceField?: string | Path | SlugSourceFn;
  schemaType: SuperSlugInputProps['schemaType'];
  path: Path;
  updateSlug: (newSlug: string) => void;
}

function getSlugSourceContext(
  valuePath: Path,
  document: SanityDocument,
  context: SlugContext,
): SlugSourceContext {
  const parentPath = valuePath.slice(0, -1);
  const parent = PathUtils.get(document, parentPath) as SlugParent;
  return { parentPath, parent, ...context };
}

async function getNewFromSource(
  source: string | Path | SlugSourceFn,
  document: SanityDocument,
  context: SlugSourceContext,
): Promise<string | undefined> {
  return typeof source === 'function'
    ? source(document, context)
    : PathUtils.get(document, source);
}

export function useSlugGenerator({
  apiVersion,
  sourceField,
  schemaType,
  path,
  updateSlug,
}: UseSlugGeneratorProps) {
  const getFormValue = useGetFormValue();
  const slugContext = useSlugContext({ apiVersion });
  const { t } = useTranslation();

  const handleAsyncGenerateSlug = useCallback(async () => {
    if (!sourceField) {
      return Promise.reject(
        new Error(t('inputs.slug.error.missing-source', { schemaType: schemaType.name })),
      );
    }

    const document =
      (getFormValue([]) as SanityDocument | undefined) ||
      ({ _type: schemaType.name } as SanityDocument);

    const sourceContext = getSlugSourceContext(path, document, slugContext);

    const newFromSource = await getNewFromSource(sourceField, document, sourceContext);

    updateSlug(newFromSource ?? '');
  }, [sourceField, getFormValue, schemaType, path, slugContext, updateSlug, t]);

  const [generateSlugState, handleGenerateSlug] = useAsync(handleAsyncGenerateSlug);

  return {
    generateSlugState,
    handleGenerateSlug,
    isGenerating: generateSlugState?.status === 'pending',
  };
}
