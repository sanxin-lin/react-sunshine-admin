import { createContext } from 'react';

import { createProviderValue, createSelector } from '@/hooks/utils/useContext';

export interface ModalContextProps {
  redoModalHeight: () => void;
}

export const ModalContext = createContext<ModalContextProps>({} as ModalContextProps);

export function createModalProviderValue<S>(state: S) {
  // 修改类型，否则会报类型错误
  return createProviderValue(state) as unknown as ModalContextProps;
}

export function useModalContextSelctor<R>(selector: (state: ModalContextProps) => R) {
  return createSelector(ModalContext, selector);
}
