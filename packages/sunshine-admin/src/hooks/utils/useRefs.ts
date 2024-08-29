import { useRef } from 'react';

export const useRefs = <T = any>() => {
  const refs = useRef<T[]>([]);
  refs.current = [];

  const setRefs = (index: number) => {
    return (el: T) => {
      refs.current[index] = el;
    };
  };

  return {
    refs,
    setRefs,
  };
};
