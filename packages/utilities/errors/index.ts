/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export function isFetchError(
  error: unknown,
): error is { response?: { data?: { err?: string } } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object' &&
    'data' in (error as any).response &&
    typeof (error as any).response.data === 'object'
  );
}
