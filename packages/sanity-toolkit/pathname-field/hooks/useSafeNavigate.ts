import { usePresentationNavigate } from '@sanity/presentation';

export function useSafeNavigate() {
  try {
    return usePresentationNavigate();
  } catch (e) {
    return null;
  }
}
