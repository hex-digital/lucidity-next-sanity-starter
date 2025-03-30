/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

/**
 * List of all the schema types we use in Sanity, as constants.
 * This allows us to refer to them by their constant symbol, rather than a magic string,
 * in both the Sanity Studio app, and the web app.
 *
 * See: @/docs/repo-architecture/about-constants.md
 *
 * !!!!!!                         !!!!!!!!                              !!!!!! //
 * DO NOT CHANGE THE VALUES OF THESE CONSTANTS WITHOUT CAREFUL CONSIDERATION.  //
 *     CHANGING THE VALUES WILL CAUSE CONTENT TO DISAPPEAR FROM THE CMS        //
 * !!!!!!                         !!!!!!!!                              !!!!!! //
 *
 * This is because these constants are the Sanity `_type` values. If they change,
 * you must also migrate your content to change its `_type` to the new value.
 * If you have no content yet, change them all you like.
 */

/**
 * 16/01/2025 - Jamie
 *
 * Due to Sanity Typegen not supporting enums or objects in queries, we've had to also
 * export a single variable version of each document type.
 *
 * Use the single variable versions within queries, to allow them to be typegen'd:
 *   e.g. defineQuery(`*[_type == "${DOCUMENT_PAGE}"]`)
 *
 * When Sanity Typegen supports objects and enums, we can remove all the single variables
 * and change the codebase back to just using the enum, e.g. just `${DOCUMENT.PAGE}`.
 * The issue can be tracked here: https://github.com/sanity-io/sanity/issues/8293
 * The commit where this was changed is here (to help change back): TBC
 */

export const DOCUMENT_PAGE = 'page';
export const DOCUMENT_ARTICLE = 'article';
export const DOCUMENT_AUTHOR = 'author';
export const DOCUMENT_TAXONOMY_CATEGORY = 'category';
export const DOCUMENT_TAXONOMY_TAG = 'tag';
export const DOCUMENT_CONFIG_REDIRECT = 'config.redirect';
export const DOCUMENT_CONFIG_CORE_SECTION = 'config.coreSection';
export const DOCUMENT_CONFIG_REUSABLE_BLOCK = 'config.reusableBlock';
export const DOCUMENT_ANNOUNCEMENT = 'announcement';
export const DOCUMENT_NAVIGATION_HEADER = 'navigation.header';
export const DOCUMENT_NAVIGATION_FOOTER = 'navigation.footer';
export const DOCUMENT_MEDIA_TAG = 'media.tag'; // Added by the Sanity Media Plugin

export enum DOCUMENT {
  PAGE = DOCUMENT_PAGE,

  ARTICLE = DOCUMENT_ARTICLE,

  AUTHOR = DOCUMENT_AUTHOR,

  TAXONOMY_CATEGORY = DOCUMENT_TAXONOMY_CATEGORY,
  TAXONOMY_TAG = DOCUMENT_TAXONOMY_TAG,

  CONFIG_REDIRECT = DOCUMENT_CONFIG_REDIRECT,
  CONFIG_CORE_SECTION = DOCUMENT_CONFIG_CORE_SECTION,
  CONFIG_REUSABLE_BLOCK = DOCUMENT_CONFIG_REUSABLE_BLOCK,

  ANNOUNCEMENT = DOCUMENT_ANNOUNCEMENT,
  NAVIGATION_HEADER = DOCUMENT_NAVIGATION_HEADER,
  NAVIGATION_FOOTER = DOCUMENT_NAVIGATION_FOOTER,

  MEDIA_TAG = DOCUMENT_MEDIA_TAG, // Added by the Sanity Media Plugin
}

export const OBJECT_MODULAR_OUTER_BLOCKS = 'modularContentBlocks.outer';
export const OBJECT_MODULAR_INNER_BLOCKS = 'modularContentBlocks.inner';
export const OBJECT_MODULAR_OUTER_BLOCK_SECTION = 'modularContentBlocks.outer.section';
export const OBJECT_MODULAR_INNER_BLOCK_RAW_HTML = 'modularContentBlocks.inner.rawHtml';

export enum OBJECT {
  MODULAR_OUTER_BLOCKS = OBJECT_MODULAR_OUTER_BLOCKS,
  MODULAR_INNER_BLOCKS = OBJECT_MODULAR_INNER_BLOCKS,

  MODULAR_OUTER_BLOCK_SECTION = OBJECT_MODULAR_OUTER_BLOCK_SECTION,

  MODULAR_INNER_BLOCK_RAW_HTML = OBJECT_MODULAR_INNER_BLOCK_RAW_HTML,
}

export const SINGLETON_THEME = 'theme';
export const SINGLETON_CONFIG_SEO = 'config.seo';
export const SINGLETON_CONFIG_404 = 'config.404';
export const SINGLETON_RECYCLING_BIN = 'recycling.bin';

export enum SINGLETON {
  THEME = SINGLETON_THEME,
  CONFIG_SEO = SINGLETON_CONFIG_SEO,
  CONFIG_404 = SINGLETON_CONFIG_404,
  RECYCLING_BIN = SINGLETON_RECYCLING_BIN,
}
