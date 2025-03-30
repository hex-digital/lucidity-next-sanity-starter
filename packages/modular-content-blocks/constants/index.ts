export enum BLOCK_FIELDSETS {
  META = 'meta',
  MEDIA = 'media',
}

export enum BLOCK_CATEGORY {
  OUTER = 'outer',
  INNER = 'inner',
}

export enum ONLY {
  OUTER = 'outer', // Must match BLOCK_CATEGORY.OUTER
  INNER = 'inner', // Must match BLOCK_CATEGORY.INNER
}
