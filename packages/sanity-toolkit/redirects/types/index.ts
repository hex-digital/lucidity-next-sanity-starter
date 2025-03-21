import { REDIRECT_TYPE } from '../constants';
import { PAGE_VISIBILITY } from '../../seo';

export interface RedirectsQueryPayload {
  redirects: Array<Redirect>;
  retrievedOn: string;
}

export interface RedirectMatchResult {
  matches: boolean;
  matchedRule?: Redirect;
  redirectUrl?: string;
}

export interface RedirectDocument {
  _rev: string;
  _type: string;
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  from?: null | `/${string}`;
  link?: null | RedirectLink;
  isPermanent?: null | boolean;
  group?: null | string;
}

export interface RedirectLink {
  linkType?: REDIRECT_TYPE;
  page?: ReferencedInternal;
  pageAnchor?: string;
  external?: string;
}

export interface ReferencedInternal {
  _id: string;
  _type: string;
  _rev: string;
  _updatedAt?: string;
  _originalId?: string;
  _createdAt?: string;
  title?: string;
  pathname?: string;
  pageVisibility?: PAGE_VISIBILITY;
}

/** The Redirect object we get back from our query, as we don't ask for all data */
export type Redirect = Omit<RedirectDocument, '_type' | '_rev' | '_createdAt' | '_updatedAt'>;
