import type { ObjectItemProps, ObjectMember } from 'sanity';
import { Card, Stack } from '@sanity/ui';
import type { ComponentType } from 'react';
import { ModularBlocksProvider } from '../providers/ModularBlocksProvider';
import type {
  ContentMember,
  FieldToChildFieldsMap,
  OuterBlockPreviewResult,
  SanityObjectItemPropsChildren,
} from '../types';

/**
 * Default to showing the `content` field in the second layer for each block if it's defined.
 */
const defaultFieldToChildFields: FieldToChildFieldsMap = {
  default: ['content'],
};

export function makeOuterBlockItemComponentFn(
  fieldToChildFields: FieldToChildFieldsMap = defaultFieldToChildFields,
) {
  const OuterBlockItemComponent: ComponentType<ObjectItemProps> = (props) => {
    if (
      !props.children ||
      typeof props.children !== 'object' ||
      !('props' in props.children)
    ) {
      return props.renderDefault(props);
    }

    const {
      type,
      children, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      hasInnerBlocks = false,
    } = getChildrenPreview(props, props.children as SanityObjectItemPropsChildren);

    return (
      <Stack>
        <Card>
          <Card margin={2} style={{ marginBottom: type === 'preview' ? '-10px' : '0' }}>
            <ModularBlocksProvider>{props.renderDefault(props)}</ModularBlocksProvider>
          </Card>
          {
            <Card
              paddingX={6}
              paddingBottom={hasInnerBlocks ? 5 : 4}
              borderBottom={hasInnerBlocks}
            >
              <ModularBlocksProvider overviewPreview={true}>{children}</ModularBlocksProvider>
            </Card>
          }
        </Card>
      </Stack>
    );
  };

  return OuterBlockItemComponent;

  function getChildrenPreview(
    props: ObjectItemProps,
    children: SanityObjectItemPropsChildren,
  ): OuterBlockPreviewResult {
    const type = props.value._type ?? 'default';

    const childFields =
      type in fieldToChildFields ? fieldToChildFields[type] : fieldToChildFields.default;

    const childrenProps = children.props;

    if (typeof childFields === 'function') {
      return {
        type: 'custom',
        children: childFields(childrenProps),
        hasInnerBlocks: false,
      };
    }

    const members = childrenProps.children?.props?.members;
    const contentMember = members?.find(
      (member: ObjectMember) => 'name' in member && childFields?.includes(member.name),
    ) as ContentMember | undefined;

    const modifiedMembers = !contentMember
      ? []
      : [
          {
            ...contentMember,
            field: {
              ...contentMember.field,
              schemaType: {
                ...contentMember.field?.schemaType,
                title: ' ', // Empty string to hide original field title
              },
            },
          },
        ];

    // Deep clone object so the regular modal view is unaffected
    // while showing only the "inner" modular content, and removing its "title" via empty string
    return {
      type: 'preview',
      childFields,
      hasInnerBlocks: !!contentMember,
      children: {
        ...children,
        props: {
          ...childrenProps,
          children: {
            ...((childrenProps.children ?? {}) as Record<string, any>),
            props: {
              ...((childrenProps.children?.props ?? {}) as Record<string, any>),
              members: modifiedMembers,
            },
          },
        },
      },
    };
  }
}
