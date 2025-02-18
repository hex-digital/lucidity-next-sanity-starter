import { describe, it, expect, vi } from 'vitest';
import { setDateFieldToCurrent } from '../setDateFieldToCurrent';
import { useDocumentOperation, type DocumentActionProps, type SanityDocument } from 'sanity';

vi.mock('sanity', () => ({
  useDocumentOperation: vi.fn(),
}));

const mockDraft: SanityDocument = {
  _id: 'drafts.67910e85-2584-47db-b416-4483e1c98dd5',
  _type: 'page',
  _rev: '9c84cc98-b57e-4875-a365-b978709e3cc4',
  _createdAt: '2024-10-18T12:28:47Z',
  _updatedAt: '2024-10-18T12:28:47Z',
};

const mockPublished: SanityDocument = {
  _id: '67910e85-2584-47db-b416-4483e1c98dd5',
  _type: 'page',
  _rev: '1c11cc11-b11e-1111-a365-b978709e3cc4',
  _createdAt: '2024-10-18T12:28:48Z',
  _updatedAt: '2024-10-18T12:28:48Z',
};

const mockProps: DocumentActionProps = {
  id: 'test-id',
  type: 'test-type',
  draft: mockDraft,
  published: mockPublished,
  transactionSyncLock: null,
  liveEdit: false,
  ready: true,
  onComplete: () => {},
  version: mockDraft,
  liveEditSchemaType: false,
  release: undefined,
};

describe('publishAndUpdateDate', () => {
  it('should set the field with the current date if not already set', () => {
    const mockPatch = { execute: vi.fn() };
    (useDocumentOperation as any).mockReturnValue({ patch: mockPatch });

    const originalPublishAction = vi.fn().mockReturnValue({
      onHandle: vi.fn(),
    });

    const PublishAndUpdateDate = setDateFieldToCurrent(originalPublishAction);

    const result = PublishAndUpdateDate(mockProps);
    if (result?.onHandle) {
      result.onHandle();
    }

    expect(mockPatch.execute).toHaveBeenCalledWith([
      { set: { publishedAt: expect.any(String) } },
    ]);
    expect(originalPublishAction).toHaveBeenCalledWith(mockProps);
    expect(result?.onHandle).toBeDefined();
  });

  it('should not override the field if it is already set', () => {
    const draftWithDate: SanityDocument & { publishedAt: string } = {
      ...mockDraft,
      publishedAt: '2024-10-18T12:28:47Z',
    };

    const publishedWithDate: SanityDocument & { publishedAt: string } = {
      ...mockPublished,
      publishedAt: '2024-10-18T12:28:47Z',
    };

    const props: DocumentActionProps = {
      ...mockProps,
      draft: draftWithDate,
      published: publishedWithDate,
    };

    const mockPatch = { execute: vi.fn() };
    (useDocumentOperation as any).mockReturnValue({ patch: mockPatch });

    const originalPublishAction = vi.fn().mockReturnValue({
      onHandle: vi.fn(),
    });

    const PublishAndUpdateDate = setDateFieldToCurrent(originalPublishAction);

    const result = PublishAndUpdateDate(props);
    if (result?.onHandle) {
      result.onHandle();
    }

    expect(mockPatch.execute).not.toHaveBeenCalled();
    expect(originalPublishAction).toHaveBeenCalledWith(props);
    expect(result?.onHandle).toBeDefined();
  });
});
