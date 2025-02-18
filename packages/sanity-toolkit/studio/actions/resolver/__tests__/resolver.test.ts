import { describe, it, expect, vi } from 'vitest';
import type {
  DocumentActionComponent,
  DocumentActionProps,
  DocumentActionsContext,
} from 'sanity';
import { resolveActionsPipeline, actionsPipeline, newAction, modifyAction } from '../index';

describe('Action Resolver', () => {
  // Setup common test variables and helpers
  const mockContext: DocumentActionsContext = {
    schemaType: 'testType',
    documentId: 'test-123',
  } as unknown as DocumentActionsContext;

  const mockPublishAction: DocumentActionComponent = () => null;
  mockPublishAction.action = 'publish';

  const mockPublishActionModifier: DocumentActionComponent = () => ({ label: 'Update' });
  const mockSecondPublishActionModifier: DocumentActionComponent = () => ({
    label: 'Second Update',
  });

  const mockNewAction: DocumentActionComponent = () => ({ label: 'New Action' });

  function createModifierAndTest(modifierConfig: any) {
    const handler = vi.fn(() => mockPublishActionModifier);
    const modifier = modifyAction({
      actions: 'publish',
      handler,
      ...modifierConfig,
    });

    const result = actionsPipeline([mockPublishAction], mockContext, [modifier]);
    const actionObject = result[0]?.({} as DocumentActionProps);

    return { result, actionObject, handler };
  }

  function assertBasicModifierBehavior(
    result: any[],
    actionObject: any,
    handler: any,
    expectedLength = 1,
  ) {
    expect(result).toHaveLength(expectedLength);
    expect(handler).toHaveBeenCalledWith(mockPublishAction, mockContext);
    expect(actionObject?.label).toBe('Update');
  }

  describe('modifyActionsFn', () => {
    it('should apply handler to all actions when passed a function', () => {
      const { result, actionObject, handler } = createModifierAndTest({});
      assertBasicModifierBehavior(result, actionObject, handler);
    });

    it('should add new action when using defineNewAction', () => {
      const newDocAction = newAction({
        actionComponent: mockNewAction,
      });

      const result = actionsPipeline([mockPublishAction], mockContext, [newDocAction]);
      const actionObject = result[1]?.({} as DocumentActionProps);

      expect(result).toHaveLength(2);
      expect(actionObject?.label).toBe('New Action');
    });

    it('should only add new action for specified schema types', () => {
      const newDocAction = newAction({
        schemaTypes: ['testType'],
        actionComponent: mockNewAction,
      });

      const newDocActionDontAdd = newAction({
        schemaTypes: ['wrongType'],
        actionComponent: mockNewAction,
      });

      const result = actionsPipeline([mockPublishAction], mockContext, [
        newDocAction,
        newDocActionDontAdd,
      ]);

      expect(result).toHaveLength(2);
    });

    it('should handle multiple action modifiers in sequence', () => {
      const handler = vi.fn(() => mockPublishActionModifier);
      const handler2 = vi.fn(() => mockSecondPublishActionModifier);

      const modifier = modifyAction({ actions: 'publish', handler });
      const modifier2 = modifyAction({ actions: 'publish', handler: handler2 });

      const result = actionsPipeline([mockPublishAction], mockContext, [modifier, modifier2]);
      const actionObject = result[0]?.({} as DocumentActionProps);

      expect(result).toHaveLength(1);
      expect(handler).toHaveBeenCalledWith(mockPublishAction, mockContext);
      expect(handler2).toHaveBeenCalledWith(mockPublishActionModifier, mockContext);
      expect(actionObject?.label).toBe('Second Update');
    });

    it('can be called with string schemaTypes', () => {
      const { result, actionObject, handler } = createModifierAndTest({
        schemaTypes: 'testType',
      });
      assertBasicModifierBehavior(result, actionObject, handler);
    });

    it('can be called with array schemaTypes', () => {
      const { result, actionObject, handler } = createModifierAndTest({
        schemaTypes: ['testType', 'otherType'],
      });
      assertBasicModifierBehavior(result, actionObject, handler);
    });

    it('can be called with no schemaTypes', () => {
      const { result, actionObject, handler } = createModifierAndTest({});
      assertBasicModifierBehavior(result, actionObject, handler);
    });

    it('can be called with string actions', () => {
      const { result, actionObject, handler } = createModifierAndTest({
        actions: 'publish',
      });
      assertBasicModifierBehavior(result, actionObject, handler);
    });

    it('can be called with array actions', () => {
      const { result, actionObject, handler } = createModifierAndTest({
        actions: ['publish', 'delete'],
      });
      assertBasicModifierBehavior(result, actionObject, handler);
    });

    it('can be called with no actions', () => {
      const { result, actionObject, handler } = createModifierAndTest({
        actions: undefined,
      });
      assertBasicModifierBehavior(result, actionObject, handler);
    });
  });

  describe('modifyActions', () => {
    it('should return a resolver function', () => {
      const resolver = resolveActionsPipeline([]);
      expect(typeof resolver).toBe('function');
    });

    it('should call callback if provided', () => {
      const callback = vi.fn(() => []);
      const resolver = resolveActionsPipeline([], callback);

      resolver([mockPublishAction], mockContext);

      expect(callback).toHaveBeenCalled();
    });
  });
});
