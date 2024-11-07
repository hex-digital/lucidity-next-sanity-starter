import type {
  FieldDefinitionBase,
  ObjectFieldProps,
  Path,
  SanityDocument,
  SlugDefinition,
  SlugOptions,
  SlugValue,
} from 'sanity';
import { type SlugContext } from '../hooks';

export interface DocForPath extends MinimalDocForPath {}

export interface MinimalDocForPath {
  _type: string;
  _id: string;
  pathname?: string;
  locale?: LocaleConfiguration['value'];
  _updatedAt: string;
  _createdAt: string;
}

export interface LocaleConfiguration {
  /**
   * If adding full locales (English, USA) instead of just plain languages (English), they should
   * be formatted according to RFC 5646: Tags for Identifying Languages (also known as BCP 47).
   *
   * Example: `en-us` instead of `en_us`.
   *
   * Capitalized or not, it doesn't make a difference - we'll make them all lowercase.
   */
  value: string;
  title: string;
  isDefault?: boolean;
}

/**
 * Should match Language from here: https://github.com/sanity-io/document-internationalization/blob/main/src/types.ts
 * Extracted here to prevent the need for an explicit dependency on that package in case user's aren't using multilang
 */
export type Locale = {
  id: Intl.UnicodeBCP47LocaleIdentifier;
  title: string;
};

export interface DocumentWithLocale extends SanityDocument {
  locale: Locale['id'];
}

export type LocalizePathnameFn = (opts: {
  pathname: string;
  localeId?: string;
  isDefault?: boolean;
  fallbackLocaleId?: string;
}) => string;

export type PathnamePrefix =
  | string
  | ((doc: SanityDocument, context: SlugContext) => Promise<string> | string);

export type PathnameSourceFn = (
  document: SanityDocument,
  context: SlugContext,
) => string | Promise<string>;

export type PathnameOptions = Pick<SlugOptions, 'isUnique'> & {
  source?: string | Path | PathnameSourceFn;
  prefix?: PathnamePrefix;
  folder?: {
    canUnlock?: boolean;
  };
  i18n?: {
    enabled?: boolean;
    defaultLocaleId?: string;
    localizePathname?: LocalizePathnameFn;
  };
  autoNavigate?: boolean;
};

export type PathnameParams = Omit<
  SlugDefinition & FieldDefinitionBase,
  'type' | 'options' | 'name'
> & {
  name?: string;
  options?: PathnameOptions;
};

export type PathnameInputProps = ObjectFieldProps<SlugValue> & {
  schemaType: { options?: PathnameOptions };
};
