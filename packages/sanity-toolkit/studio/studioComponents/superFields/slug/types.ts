import type {
  SanityDocument,
  SlugSourceContext,
  SlugOptions,
  SlugDefinition,
  SlugSchemaType,
  SlugInputProps,
} from 'sanity';

// See: https://github.com/sanity-io/sanity/blob/next/packages/sanity/src/core/form/inputs/Slug/utils/useSlugContext.ts
export type SlugContext = Omit<SlugSourceContext, 'parent' | 'parentPath'>;

// @todo support type ((doc: SanityDocument, context: SlugContext) => Promise<string> | string)
export type SlugPrefix = string;

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

/**
 * The available options for a SuperString field.
 */
export type SuperSlugSchemaOptions = SlugOptions & {
  prefix?: SlugPrefix;
  folder?: {
    canUnlock?: boolean;
  };
  i18n?: {
    enabled?: boolean;
    defaultLocaleId?: string;
    localizeSlug?: LocalizeSlugFn;
  };
  autoNavigate?: boolean;
};

/**
 * The schema definition for the SuperString field, i.e. within the `defineField({})` call.
 * You can also pass any of the properties of Sanity object types described here: https://www.sanity.io/docs/string-type
 */
export interface SuperSlugSchemaDefinition extends SlugDefinition {
  options?: SlugSchemaType['options'] & SuperSlugSchemaOptions;
  // @todo May not need this—was ported from another component. If all types working then this is likely fine.
  // validation?: SchemaValidationValue /** This fixes error "ValidationBuilder<StringRule, string> | undefined is not assignable to type SchemaValidationValue" */;
}

/** Props passed to this component */
export interface SuperSlugInputProps extends SlugInputProps {
  schemaType: SlugInputProps['schemaType'] & {
    options?: SlugInputProps['schemaType']['options'] & SuperSlugSchemaOptions;
  };
}
