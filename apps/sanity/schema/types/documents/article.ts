import { defineField, defineType } from 'sanity';
import { DOCUMENT, OBJECT } from '@pkg/common/constants/schemaTypes';
import {
  defineVisibilityField,
  visibilityPreview,
} from '@pkg/sanity-toolkit/seo/schema/defineVisibilityField';
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
import { GrArticle } from 'react-icons/gr';
import { URL_PREFIX } from '@pkg/common/constants/urlPrefixes';
import { validPostTimestamps } from '@pkg/sanity-toolkit/studio/schema/validation';
import { isDeveloperOrAdmin } from '@pkg/sanity-toolkit/studio/utilities/roles';
import { defineImageField } from '@pkg/sanity-toolkit/studio/schema/fields/defineImageField';

interface Prepare {
  title?: string;
  pathname?: string;
  visibility?: PAGE_VISIBILITY;
  image?: any;
}

export const article = defineType({
  name: DOCUMENT.ARTICLE,
  title: 'Article',
  type: 'document',
  icon: GrArticle,

  groups: [GROUP_META, { ...GROUP_CONTENT, default: true }, GROUP_SEO],

  fieldsets: [seoFieldset()],

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the article. Shown in the article header and in lists',
      group: [FIELD_GROUPS.META, FIELD_GROUPS.CONTENT],
      validation: (rule) => rule.required(),
    }),

    ...withGroup(FIELD_GROUPS.META, [
      defineVisibilityField(),
      defineSlugField({
        initialValue: { current: `${URL_PREFIX.ARTICLES}/` },
        options: { source: 'title', folder: { canUnlock: false } },
      }),

      defineField({
        title: 'Published At',
        name: 'publishedAt',
        type: 'datetime',
        description:
          'The date this article was published. If blank, will be set automatically when article is published. May show on the article itself, in the sitemap, or in any RSS feeds',
        validation: (rule) =>
          rule
            .custom(
              validPostTimestamps(
                'updatedAt',
                'after',
                undefined,
                'Published At',
                'Updated At',
              ),
            )
            .error(),
      }),
      defineField({
        title: 'Updated At',
        name: 'updatedAt',
        type: 'datetime',
        group: 'meta',
        description:
          'Optional. Manually specify the date this article was updated. Will NOT be updated automatically. May show on the article itself, in the sitemap, or in any RSS feeds',
        validation: (rule) =>
          rule
            .custom(
              validPostTimestamps(
                'publishedAt',
                'before',
                undefined,
                'Updated At',
                'Published At',
              ),
            )
            .error(),
      }),
      defineField({
        title: 'Reading time',
        name: 'readingTime',
        type: 'string',
        description:
          "The reading time of the article's content. Set automatically when article is published or updated",
        readOnly: true,
        hidden: ({ currentUser }) => !isDeveloperOrAdmin(currentUser),
        initialValue: 'Less than 1',
      }),
      defineField({
        ...defineImageField(),
        title: 'Article Image',
        name: 'image',
        description:
          'This image is displayed on the article and in any list where the article appears',
        validation: (rule) =>
          rule
            .required()
            .warning(
              'An image is recommend. Images make search results look more inviting and engaging',
            ),
      }),
    ]),

    ...withGroup(FIELD_GROUPS.CONTENT, [
      defineField({
        title: 'Excerpt',
        name: 'excerpt',
        type: 'text',
        rows: 5,
        description:
          'A brief description or excerpt that is displayed in some lists where the article appears',
        validation: (rule) =>
          rule
            .required()
            .warning(
              'An excerpt is recommend. Excerpts make it easier for users to find what they are looking for',
            ),
      }),
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
      image: 'image',
    },
    prepare({ title, pathname, visibility, image }: Partial<Prepare>) {
      const subtitle: Array<string> = [visibilityPreview(visibility)];

      console.log('image', image);

      if (pathname) {
        subtitle.push(pathname);
      }

      return {
        title: title ?? 'Unnamed',
        subtitle: subtitle.join(' - '),
        media: image,
      };
    },
  },
});
