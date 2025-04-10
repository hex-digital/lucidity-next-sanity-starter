import { usePresentationNavigate } from 'sanity/presentation';

export function useSafeNavigate() {
  try {
    return usePresentationNavigate();
  } catch {
    return null;
  }
}
