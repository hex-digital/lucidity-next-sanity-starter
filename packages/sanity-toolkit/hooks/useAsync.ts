// See: https://github.com/sanity-io/sanity/blob/main/packages/sanity/src/core/form/inputs/Slug/utils/useAsync.tsx
// Customised specifically at time of this commit: https://github.com/sanity-io/sanity/blob/d157fca17d146886413f86577258fb24ee35e3d2/packages/sanity/src/core/form/inputs/Slug/utils/useAsync.tsx

import { useCallback, useRef, useState } from 'react';

export interface AsyncCompleteState<T> {
  status: 'complete';
  result: T;
}
export interface AsyncPendingState {
  status: 'pending';
}
export interface AsyncErrorState {
  status: 'error';
  error: Error;
}

export type AsyncState<T> = AsyncPendingState | AsyncCompleteState<T> | AsyncErrorState;

/**
 * Takes an async function and returns a [AsyncState<value>, callback] pair.
 * Whenever the callback is invoked, a new AsyncState is returned.
 * If the returned callback is called again before the previous callback has settled, the resolution of the previous one will be ignored, thus preventing race conditions.
 * @param fn - an async function that returns a value
 */
export function useAsync<T, U = void>(
  fn: (arg: U | void) => Promise<T>,
): [null | AsyncState<T>, (arg: U | void) => void] {
  const [state, setState] = useState<AsyncState<T> | null>(null);

  const lastId = useRef(0);

  const wrappedCallback = useCallback(
    (arg: U | void) => {
      const asyncId = ++lastId.current;
      setState({ status: 'pending' });

      Promise.resolve()
        .then(async () => fn(arg))
        .then(
          (res) => {
            if (asyncId === lastId.current) {
              setState({ status: 'complete', result: res });
            }
          },
          (err: Error) => {
            if (asyncId === lastId.current) {
              setState({ status: 'error', error: err });
            }
          },
        );
    },
    [fn],
  );

  return [state, wrappedCallback];
}
