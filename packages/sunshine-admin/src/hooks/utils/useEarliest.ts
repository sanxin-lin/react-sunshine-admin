import { MutableRefObject, useRef } from 'react';

export const useEarliest = <T = any>(fn: () => T) => {
  const value = useRef<T>();

  if (!value.current) {
    value.current = fn();
  }

  return value as MutableRefObject<T>;
};
