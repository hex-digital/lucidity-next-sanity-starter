import type { ObjectDefinition } from 'sanity';
import type { ObjectOptions } from 'sanity';

/**
 * Pass any of the properties of Sanity object types described here: https://www.sanity.io/docs/object-type
 */
export interface BlockSchemaDefinition extends Omit<ObjectDefinition, 'type' | 'options'> {
  type?: ObjectDefinition['type']; // `type` doesn't need to be passed, as will default to 'object'
  options?: BlockOptions;
}

export interface BlockOptions extends ObjectOptions {}
