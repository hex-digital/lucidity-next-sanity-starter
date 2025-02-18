import { describe, it, expect } from 'vitest';
import { populateDefaultFieldValues } from '../populateDefaultFieldValues';
import { type ArrayOfObjectsInputProps } from 'sanity';

describe('populateDefaultFieldValues', () => {
  it('should populate default field values for a given schema', () => {
    const mockFieldProps = {
      schemaType: {
        of: [
          {
            name: 'testSchema',
            jsonType: 'object',
            fields: [
              {
                name: 'title',
                type: {
                  name: 'testField1',
                  jsonType: 'string',
                  initialValue: 'Default Title',
                },
              },
              { name: 'tags', type: { name: 'testField2', jsonType: 'array', of: [] } },
              {
                name: 'metadata',
                type: {
                  name: 'testField3',
                  jsonType: 'object',
                  fields: [],
                  to: [],
                },
              },
            ],
          },
        ],
      },
    } as ArrayOfObjectsInputProps;

    const result = populateDefaultFieldValues('testSchema', mockFieldProps);

    expect(result).toEqual({
      title: 'Default Title',
      tags: [],
      metadata: {},
    });
  });

  it('should return an empty object if schema is not found', () => {
    const mockFieldProps = {
      schemaType: {
        of: [],
      },
    };

    // @ts-expect-error We don't care for the actual type Sanity wants here, we just mock it
    const result = populateDefaultFieldValues('nonExistentSchema', mockFieldProps);

    expect(result).toEqual({});
  });

  it('should handle fields without initial values', () => {
    const mockFieldProps = {
      schemaType: {
        of: [
          {
            name: 'testSchema',
            jsonType: 'object',
            fields: [
              { name: 'title', type: { name: 'testField1', jsonType: 'string' } },
              { name: 'tags', type: { name: 'testField2', jsonType: 'array', of: [] } },
              { name: 'metadata', type: { name: 'testField3', jsonType: 'object' } },
            ],
          },
        ],
      },
    };

    const result = populateDefaultFieldValues(
      'testSchema',
      mockFieldProps as ArrayOfObjectsInputProps,
    );

    expect(result).toEqual({
      title: undefined,
      tags: [],
      metadata: {},
    });
  });
});
