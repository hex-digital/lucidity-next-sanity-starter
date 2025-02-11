import { SchemaTypeDefinition } from 'sanity';
import { page } from './documents/page';
import { redirects } from '@pkg/sanity-toolkit/redirects/schema';
import { DOCUMENT } from '@pkg/common/constants/schemaTypes';
import { INTERNAL_LINK_TYPES } from '@pkg/common/config/schemaTypes';
import { announcements } from '@/schema/types/documents/announcements';
import { article } from '@/schema/types/documents/article';

export const documents: SchemaTypeDefinition[] = [
  page,
  article,
  announcements,
  redirects({ schemaName: DOCUMENT.CONFIG_REDIRECT, internalLinkTypes: INTERNAL_LINK_TYPES }),
];
