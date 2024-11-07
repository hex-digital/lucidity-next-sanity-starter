import { usePresentationParams } from '@sanity/presentation';

export function useSafePreview() {
  try {
    const presentationParams = usePresentationParams();
    const { preview } = presentationParams;
    return preview;
  } catch (e) {
    return null;
  }
}
