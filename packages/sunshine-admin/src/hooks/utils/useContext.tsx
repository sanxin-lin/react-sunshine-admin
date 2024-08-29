import { Context, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { useForceRender } from './useForceRender';

import { Fn } from '#/global';
import { isFunction } from 'lodash-es';

type ContextState<S> = {
  subscribe: (cb: Fn) => () => void;
  getState: () => S;
};

export const createProvider = <C extends Context<any>, S>(
  Context: C,
  state: S,
  children: ReactNode,
) => {
  const stateRef = useRef(state);
  stateRef.current = state;
  const subscribes = useRef<Fn[]>([]);

  useEffect(() => {
    subscribes.current.forEach((cb) => cb());
  }, [state]);

  const value = useMemo(
    () => ({
      subscribe: (cb: Fn) => {
        subscribes.current.push(cb);
        return () => {
          subscribes.current = subscribes.current.filter((item) => item !== cb);
        };
      },
      getState: () => stateRef.current,
    }),
    [],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function createProviderValue<S>(state: S) {
  const stateRef = useRef(state);
  stateRef.current = state;
  const subscribes = useRef<Fn[]>([]);

  useEffect(() => {
    subscribes.current.forEach((cb) => cb());
  }, [state]);

  const value = useMemo(
    () => ({
      subscribe: (cb: Fn) => {
        subscribes.current.push(cb);
        return () => {
          subscribes.current = subscribes.current.filter((item) => item !== cb);
        };
      },
      getState: () => stateRef.current,
    }),
    [],
  );

  return value;
}

export function createSelector<C extends Context<any>, S, R>(
  Context: C,
  selector: (state: S) => R,
) {
  const _selector = selector ?? ((state) => state);
  const forceRender = useForceRender();
  const store = useContext(Context) as ContextState<S>;
  const stateRef = useRef(_selector((store.getState?.() ?? {}) as any));
  stateRef.current = _selector((store.getState?.() ?? {}) as any);

  const checkUpdate = useCallback(() => {
    if (_selector((store.getState?.() ?? {}) as any) !== stateRef.current) {
      forceRender();
    }
  }, [store]);

  useEffect(() => {
    if (isFunction(store.subscribe)) {
      const subscription = store.subscribe(checkUpdate);
      return () => {
        subscription();
      };
    }
  }, [store, checkUpdate]);

  return stateRef.current;
}
