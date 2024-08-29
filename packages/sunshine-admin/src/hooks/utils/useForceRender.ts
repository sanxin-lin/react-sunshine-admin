import { useReducer } from 'react';

export const useForceRender = () => {
  const [, forceRender] = useReducer((pre) => pre + 1, 0);
  return forceRender;
};
