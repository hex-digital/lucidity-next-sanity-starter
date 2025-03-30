import { defineField, Image, TitledListValue } from 'sanity';
import { TbSection } from 'react-icons/tb';
// import blockImage from './section-center.png';
import { OBJECT } from '@pkg/common/constants/schemaTypes';
import { withFieldset } from '@pkg/sanity-toolkit/studio/schema/utilities';
import { requiredIfParentIs } from '@pkg/sanity-toolkit/studio/schema/validation';
import { defineAnchorIdField } from '@pkg/sanity-toolkit/studio/schema/fields/defineAnchorIdField';
import { defineImageField } from '@pkg/sanity-toolkit/studio/schema/fields/defineImageField';
import { BLOCK_FIELDSETS } from '@pkg/modular-content-blocks/constants';
import {
  SECTION_MEDIA_SIZE,
  SECTION_ALIGNMENT_OPTION,
  SECTION_IMAGE_PLACEMENT,
  SECTION_MEDIA_TYPE,
} from '@pkg/common/constants/blocks/outer/section';
import { defineOuterBlock } from '@/features/modular-content-blocks/schema/defineOuterBlockField';

const placementVariants: TitledListValue<SECTION_IMAGE_PLACEMENT>[] = [
  { title: 'Image Left', value: SECTION_IMAGE_PLACEMENT.LEFT },
  { title: 'Image Right', value: SECTION_IMAGE_PLACEMENT.RIGHT },
];

const mediaVariants: TitledListValue<SECTION_MEDIA_TYPE>[] = [
  { title: 'No Media', value: SECTION_MEDIA_TYPE.NONE },
  { title: 'Image', value: SECTION_MEDIA_TYPE.IMAGE },
  { title: 'Embedded video', value: SECTION_MEDIA_TYPE.VIDEO },
];

const sizeVariants: TitledListValue<SECTION_MEDIA_SIZE>[] = [
  { title: 'Small', value: SECTION_MEDIA_SIZE.SMALL },
  { title: 'Large', value: SECTION_MEDIA_SIZE.LARGE },
];

interface SectionObjectType {
  variant?: SECTION_IMAGE_PLACEMENT;
  mediaType?: SECTION_MEDIA_TYPE;
}

const blockIcon = TbSection;

export const schema = defineOuterBlock({
  name: OBJECT.MODULAR_OUTER_BLOCK_SECTION,
  title: 'Section',
  icon: blockIcon,
  // @todo add block images when we have the block picker added
  // options: {
  //   variants: [{ assetUrl: blockImage as string }],
  // },
  fields: [
    ...withFieldset(BLOCK_FIELDSETS.META, [
      defineAnchorIdField(),
      defineField({
        title: 'Alignment',
        name: 'alignment',
        type: 'string',
        options: {
          list: [
            { title: 'Left', value: SECTION_ALIGNMENT_OPTION.LEFT },
            { title: 'Center', value: SECTION_ALIGNMENT_OPTION.CENTER },
            { title: 'Right', value: SECTION_ALIGNMENT_OPTION.RIGHT },
          ],
        },
        initialValue: 'left',
      }),
    ]),

    defineField({
      name: 'content',
      title: 'Inner Content',
      type: OBJECT.MODULAR_INNER_BLOCKS,
    }),

    ...withFieldset(BLOCK_FIELDSETS.MEDIA, [
      defineField({
        name: 'mediaType',
        title: 'Media type',
        type: 'string',
        description: 'Decide which type of media',
        options: {
          list: mediaVariants,
          layout: 'radio',
        },
        initialValue: SECTION_MEDIA_TYPE.NONE,
      }),
      defineField({
        name: 'variant',
        title: 'Image Placement',
        type: 'string',
        description: 'Decide which side of the screen the media should appear on',
        options: {
          list: placementVariants,
          layout: 'radio',
        },
        initialValue: SECTION_IMAGE_PLACEMENT.LEFT,
        validation: (Rule) =>
          Rule.custom(
            requiredIfParentIs(
              { mediaType: [SECTION_MEDIA_TYPE.VIDEO, SECTION_MEDIA_TYPE.IMAGE] },
              'Media variant selected but no placement. Add a placement or choose No Image to remove this warning',
            ),
          ).warning(),
        hidden: ({ parent }) =>
          (parent as SectionObjectType).mediaType === SECTION_MEDIA_TYPE.NONE,
      }),
      defineField({
        name: 'mediaSize',
        title: 'Media Size',
        type: 'string',
        description:
          'Decide which size the media should have. Large will fill 1/2, small will fill a 1/3',
        options: {
          list: sizeVariants,
          layout: 'radio',
        },
        initialValue: SECTION_MEDIA_SIZE.LARGE,
        hidden: ({ parent }) =>
          (parent as SectionObjectType).mediaType === SECTION_MEDIA_TYPE.NONE,
      }),
      defineField({
        name: 'embeddedVideoUrl',
        title: 'Embedded video url',
        type: 'string',
        description: 'Enter the url you want to embed',
        validation: (Rule) =>
          Rule.custom(
            requiredIfParentIs(
              { mediaType: [SECTION_MEDIA_TYPE.VIDEO] },
              'Video variant selected but no video url was given. Add a video url or choose No Image to remove this warning',
            ),
          ).warning(),
        hidden: ({ parent }) =>
          (parent as SectionObjectType).mediaType !== SECTION_MEDIA_TYPE.VIDEO,
      }),
      defineField({
        ...defineImageField(),
        hidden: ({ parent }) =>
          (parent as SectionObjectType).mediaType !== SECTION_MEDIA_TYPE.IMAGE,
        validation: (rule) =>
          rule
            .custom(
              requiredIfParentIs(
                { mediaType: [SECTION_MEDIA_TYPE.IMAGE] },
                'Image variant selected but no image provided. Add an image or choose No Image to remove this warning',
              ),
            )
            .warning(),
      }),
    ]),
  ],
  preview: {
    select: {
      image: 'image',
      variant: 'variant',
    },
    prepare() {
      return {
        title: 'Section',
        media: blockIcon,
      };
    },
  },
});
