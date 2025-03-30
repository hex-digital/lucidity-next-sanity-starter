import type { ItemProps } from 'sanity';

import { useModularBlocks } from '../hooks/useModularBlocks';

export function PreventClickAwayItemComponent(props: ItemProps) {
  const { state } = useModularBlocks();

  if (!('onClose' in props)) {
    return props.renderDefault(props);
  }

  return props.renderDefault({
    ...props,
    onClose: (...args) => {
      if (!state.overviewPreview) {
        // This isn't an overviewPreview, so it's the real onClose handler. So close it!
        props.onClose(...args);
      }
    },
  });
}
