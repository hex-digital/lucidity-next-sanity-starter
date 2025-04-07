import type { JSX } from 'react';
import type {
  SanityDocument,
  SlugSourceContext,
  SlugOptions,
  SlugDefinition,
  SlugSchemaType,
  SlugInputProps,
} from 'sanity';
import type { UseSuperSlugField } from './hooks/useSuperSlugField';

// See: https://github.com/sanity-io/sanity/blob/next/packages/sanity/src/core/form/inputs/Slug/utils/useSlugContext.ts
export type SlugContext = Omit<SlugSourceContext, 'parent' | 'parentPath'>;

/**
 * The prefix for a slug. Can be a static string or a function (sync/async)
 * that resolves to a string based on the document and context.
 */
export type SlugPrefix =
  | string
  | ((doc: SanityDocument, context: SlugContext) => Promise<string> | string);

export type SlugSourceFn = (
  document: SanityDocument,
  context: SlugSourceContext,
) => string | Promise<string>;

/** This may need to move somewhere more general in future */
export type LocalizeSlugFn = (opts: {
  slug: string;
  localeId?: string;
  isDefault?: boolean;
  fallbackLocaleId?: string;
}) => string;

export type SuperSlugActionsFn = (
  props: SuperSlugInputProps,
  field: UseSuperSlugField,
) => JSX.Element | null;

/**
 * The available options for a SuperString field.
 */
export type SuperSlugSchemaOptions = SlugOptions & {
  prefix?: SlugPrefix;
  apiVersion: string;
  folder?: {
    canUnlock?: boolean;
  };
  autoNavigate?: boolean;
  hideGenerate?: boolean;
  afterUpdate?: (
    props: SuperSlugInputProps,
    document: SanityDocument,
    slugContext: SlugContext,
  ) => void;
  actions?: Array<SuperSlugActionsFn>;
};

/**
 * The schema definition for the SuperString field, i.e. within the `defineField({})` call.
 * You can also pass any of the properties of Sanity object types described here: https://www.sanity.io/docs/string-type
 */
export interface SuperSlugSchemaDefinition extends SlugDefinition {
  options?: SlugSchemaType['options'] & SuperSlugSchemaOptions;
}

/** Props passed to this component */
export interface SuperSlugInputOriginalProps extends SlugInputProps {
  schemaType: SlugInputProps['schemaType'] & {
    options?: SlugInputProps['schemaType']['options'] & SuperSlugSchemaOptions;
  };
}

/** Props passed from root component to all other components. Always initialised with an 'options' object */
export interface SuperSlugInputProps extends SlugInputProps {
  schemaType: SlugInputProps['schemaType'] & {
    options: SlugInputProps['schemaType']['options'] & SuperSlugSchemaOptions;
  };
}
