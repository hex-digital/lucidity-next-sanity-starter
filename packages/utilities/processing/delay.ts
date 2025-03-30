export async function delay(timeMs: number, value?: any) {
  return new Promise((resolve) => setTimeout(resolve, timeMs, value));
}
