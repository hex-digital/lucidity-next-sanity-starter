import { DOCUMENT, SINGLETON } from '../constants/schemaTypes';

/**
 * Document Types that should be shown in Internal Link fields, e.g. in Header Nav Menu.
 */
export const INTERNAL_LINK_TYPES = [DOCUMENT.PAGE];

/**
 * Document types which:
 *  - should not be able to be created in the 'new document' menu
 *  - should not be able to be duplicated, unpublished or deleted
 *
 * This is commonly used for singletons.
 */
export const LOCKED_DOCUMENT_TYPES: Array<string> = [
  ...Object.values(SINGLETON), // All Singleton types
  DOCUMENT.MEDIA_TAG,
];

/**
 * Document types that should display a link to the Page view for themselves, in Presentation mode.
 *
 * NOTE this will use the default document resolver of ID or reference to ID. If a different resolver
 * is required, it can be defined for the document type in `apps/sanity/presentation/resolvers/index.ts`
 */
export const PREVIEWABLE_DOCUMENT_TYPES: Array<string> = [
  ...INTERNAL_LINK_TYPES,
  SINGLETON.THEME,
];

/**
 * Document types that should be creatable and visible in the 'Pages' Presentation Tool.
 */
export const PRESENTATION_TOOL_CREATEABLE_TYPES: Array<string> = [
  DOCUMENT.PAGE,
  DOCUMENT.ARTICLE,
];

/**
 * Document types that are able to display an SEO Preview pane.
 */
export const SEO_PREVIEW_DOCUMENT_TYPES: Array<string> = [
  // All preview-able types except SINGLETON.THEME
  ...PREVIEWABLE_DOCUMENT_TYPES.filter((type) => type !== (SINGLETON.THEME as string)),
  SINGLETON.CONFIG_SEO,
];

/**
 * Document types that should have the "incoming references" pane when editing.
 * This pane lists all other documents that reference this document.
 * Useful for viewing a quick list of pages that use a particular form, for instance.
 */
export const INCOMING_REFERENCE_LIST: Array<string> = [
  ...INTERNAL_LINK_TYPES,
  DOCUMENT.AUTHOR,
];

/**
 * Document types that should be listed in our sitemap.xml file.
 */
export const DOCUMENTS_IN_SITEMAP: Array<DOCUMENT> = [...INTERNAL_LINK_TYPES];

/**
 * Document types that should be listed in our RSS and JSON feeds
 */
export const DOCUMENTS_IN_RSS_FEED: Array<DOCUMENT> = [DOCUMENT.ARTICLE];
