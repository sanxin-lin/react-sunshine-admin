import { useRef, useState } from 'react';

export const useGetState = <T>(defaultValue: T) => {
  const [state, setState] = useState(defaultValue);
  const stateRef = useRef<T>(defaultValue);

  const setStateFn = (v: Parameters<typeof setState>[0]) => {
    stateRef.current = v as T;
    setState(v);
  };

  const getState = () => {
    return stateRef.current;
  };

  return [state, setStateFn, getState] as const;
};
