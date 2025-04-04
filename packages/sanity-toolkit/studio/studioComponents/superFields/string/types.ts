import type {
  StringDefinition,
  StringInputProps,
  StringSchemaType,
  SchemaValidationValue,
} from 'sanity';
import type { CharCountOptions } from '../../characterCount/types';

/**
 * The available options for a SuperString field.
 */
type SuperStringSchemaOptions = CharCountOptions;

/**
 * The schema definition for the SuperString field, i.e. within the `defineField({})` call.
 * You can also pass any of the properties of Sanity object types described here: https://www.sanity.io/docs/string-type
 */
export interface SuperStringSchemaDefinition extends Omit<StringDefinition, 'validation'> {
  options?: StringSchemaType['options'] & SuperStringSchemaOptions;
  validation?: SchemaValidationValue /** This fixes error "ValidationBuilder<StringRule, string> | undefined is not assignable to type SchemaValidationValue" */;
}

/**
 * The Input Props passed to the component during render.
 */
export interface SuperStringInputProps extends StringInputProps {
  schemaType: StringInputProps['schemaType'] & {
    options?: StringInputProps['schemaType']['options'] & SuperStringSchemaOptions;
  };
}
