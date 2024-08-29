import { createContext } from 'react';

import { createProviderValue, createSelector } from '@/hooks/utils/useContext';

import type { RootMenuContextProps } from './types';

export const RootMenuContext = createContext<RootMenuContextProps>({} as RootMenuContextProps);

// export function createRootMenuProvider<S>(state: S, children: ReactNode) {
//   return createProvider(RootMenuContext, state, children);
// }

export function createRootMenuProviderValue<S>(state: S) {
  // 修改类型，否则传 RootMenuContext.Provider 的时候会报类型错误
  return createProviderValue(state) as unknown as RootMenuContextProps;
}

// export function createRootMenuProviderValue<S>(state: S) {
//   // 修改类型，否则传 RootMenuContext.Provider 的时候会报类型错误
//   return createProviderValue(state) as unknown as RootMenuContextProps;
// }

export function useRootMenuContextSelctor<R>(selector: (state: RootMenuContextProps) => R) {
  return createSelector(RootMenuContext, selector);
}
