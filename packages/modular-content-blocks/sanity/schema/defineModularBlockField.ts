// import { BlockSchemaDefinition } from '../../components/BlockWizard/types/blockSchema';
import { makeOuterBlockItemComponentFn } from '../components/OuterBlockItemComponent';
// import { InnerBlockItemComponent } from '../../components/InnerBlockItemComponent';
import { innerBlockFieldsets, outerBlockFieldsets } from './blockFieldsets';
import type { BlockSchemaDefinition } from '../../types/BlockSchemaDefinition';
import type { FieldToChildFieldsMap } from '../types';

/**
 * Define the
 * @param fieldToChildFields
 */
export function defineOuterBlockFn(fieldToChildFields?: FieldToChildFieldsMap) {
  return function defineOuterBlock(schemaTypeDefinition: BlockSchemaDefinition) {
    return {
      ...schemaTypeDefinition,
      type: 'object',
      fieldsets: [...outerBlockFieldsets(), ...(schemaTypeDefinition.fieldsets ?? [])],
      components: {
        ...schemaTypeDefinition.components,
        item:
          schemaTypeDefinition.components?.item ??
          makeOuterBlockItemComponentFn(fieldToChildFields),
      },
    } satisfies BlockSchemaDefinition;
  };
}

export function defineInnerBlock(schemaTypeDefinition: BlockSchemaDefinition) {
  return {
    ...schemaTypeDefinition,
    type: 'object',
    fieldsets: [...innerBlockFieldsets(), ...(schemaTypeDefinition.fieldsets ?? [])],
    components: {
      ...schemaTypeDefinition.components,
      // item: schemaTypeDefinition.components?.item ?? InnerBlockItemComponent,
    },
  } satisfies BlockSchemaDefinition;
}
