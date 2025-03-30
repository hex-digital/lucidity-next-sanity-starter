import { use } from 'react';
import { ModularBlocksContext } from '../context/modularBlocksContext';

export const useModularBlocks = () => {
  return use(ModularBlocksContext);
};
