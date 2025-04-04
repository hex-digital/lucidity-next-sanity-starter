import { defineField, defineType } from 'sanity';
import { PiFilesBold } from 'react-icons/pi';
import { DOCUMENT, OBJECT } from '@pkg/common/constants/schemaTypes';
import {
  defineVisibilityField,
  visibilityPreview,
} from '@pkg/sanity-toolkit/seo/schema/defineVisibilityField';
import { defineInternalTitleField } from '@pkg/sanity-toolkit/studio/schema/fields/defineInternalTitleField';
import { PAGE_VISIBILITY, SEO_FIELDSET } from '@pkg/sanity-toolkit/seo/constants';
import { withFieldset, withGroup } from '@pkg/sanity-toolkit/studio/schema/utilities';
import { seoFieldset } from '@pkg/sanity-toolkit/seo/schema/seoFieldset';
import {
  FIELD_GROUPS,
  GROUP_CONTENT,
  GROUP_META,
  GROUP_SEO,
} from '@pkg/sanity-toolkit/studio/constants/fieldGroups';
import { orderByPathname, orderByTitle } from '@pkg/sanity-toolkit/studio/schema/orderings';
import { defineSlugField } from '@/features/generic/schema/defineSlugField';
import { defineSeoFields } from '@/features/seo/schema/defineSeoFields';

interface Prepare {
  title?: string;
  pathname?: string;
  visibility?: PAGE_VISIBILITY;
}

export const page = defineType({
  name: DOCUMENT.PAGE,
  title: 'Page',
  type: 'document',
  icon: PiFilesBold,

  groups: [GROUP_META, GROUP_CONTENT, GROUP_SEO],

  fieldsets: [seoFieldset()],

  fields: [
    ...withGroup([FIELD_GROUPS.META, FIELD_GROUPS.CONTENT], [defineInternalTitleField()]),

    ...withGroup(FIELD_GROUPS.META, [
      defineVisibilityField(),
      defineSlugField({ options: { source: 'title' }, validation: (rule) => rule.required() }),
    ]),

    ...withGroup(FIELD_GROUPS.CONTENT, [
      defineField({
        name: 'content',
        title: 'Modular Content',
        type: OBJECT.MODULAR_OUTER_BLOCKS,
      }),
    ]),

    ...withGroup(FIELD_GROUPS.SEO, [...withFieldset(SEO_FIELDSET, [...defineSeoFields()])]),
  ],
  orderings: [orderByPathname(), orderByTitle()],
  preview: {
    select: {
      title: 'title',
      pathname: 'pathname.current',
      visibility: 'pageVisibility',
    },
    prepare({ title, pathname, visibility }: Partial<Prepare>) {
      const subtitle: Array<string> = [visibilityPreview(visibility)];

      if (pathname) {
        subtitle.push(pathname);
      }

      return {
        title: title ?? 'Unnamed',
        subtitle: subtitle.join(' - '),
      };
    },
  },
});
