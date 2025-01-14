import { defineField } from 'sanity';
import { FaCode } from 'react-icons/fa';
import { withFieldset } from '@pkg/sanity-toolkit/studio/schema/utilities';
import { OBJECT } from '@pkg/common/constants/schemaTypes';
import { BLOCK_FIELDSETS } from '@pkg/modular-content-blocks/constants';
import { defineInnerBlock } from '@pkg/modular-content-blocks/sanity/schema/defineModularBlockField';
import { defineAnchorIdField } from '@pkg/sanity-toolkit/studio/schema/fields/defineAnchorIdField';

const blockName = 'Raw HTML';
const blockIcon = FaCode;

export const schema = defineInnerBlock({
  title: blockName,
  name: OBJECT.MODULAR_INNER_BLOCK_RAW_HTML,
  icon: blockIcon,
  fields: [
    ...withFieldset(BLOCK_FIELDSETS.META, [defineAnchorIdField({ type: 'content' })]),

    defineField({
      name: 'content',
      title: 'Content',
      type: 'code',
      options: {
        language: 'html',
        languageAlternatives: [{ title: 'HTML', value: 'html' }],
      },
      validation: (rule) =>
        rule
          .required()
          .warning('RawHtml inner block is empty—you should add content or remove it'),
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }: Preview) {
      return {
        title: content?.code ? content.code : '[Empty]',
        subtitle: blockName,
        media: blockIcon,
      };
    },
  },
});

interface Preview {
  content?: {
    _type: 'code';
    code?: string;
  };
}
