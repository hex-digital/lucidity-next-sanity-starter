import {
  DefaultDocumentNodeContext,
  StructureBuilder,
  View,
  ViewBuilder,
} from 'sanity/structure';
import { LuPencilLine } from 'react-icons/lu';
import { seoPreviewPane } from '@/structure/seo-pane';
import { SEO_PREVIEW_DOCUMENT_TYPES } from '@pkg/common/config/schemaTypes';

export function defaultViews(
  S: StructureBuilder,
  context: DefaultDocumentNodeContext,
): Array<View | ViewBuilder> {
  const views: Array<View | ViewBuilder> = [S.view.form().icon(LuPencilLine)];

  // if (PREVIEWABLE_DOCUMENT_TYPES.includes(context.schemaType)) {
  //   views.push(previewPane(S, context, options.apiVersion));
  // }

  if (SEO_PREVIEW_DOCUMENT_TYPES.includes(context.schemaType)) {
    views.push(seoPreviewPane(S));
  }

  // if (INCOMING_REFERENCE_LIST.includes(context.schemaType)) {
  //   views.push(backlinksPane(S));
  // }

  return views;
}
