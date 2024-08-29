import { createContext } from 'react';

import { createProviderValue, createSelector } from '@/hooks/utils/useContext';

export interface FormContextProps {
  resetAction: () => Promise<void>;
  submitAction: () => Promise<void>;
}

export const FormContext = createContext<FormContextProps>({} as FormContextProps);

export const createFormProviderValue = <S>(state: S) => {
  // 修改类型，否则传 RootMenuContext.Provider 的时候会报类型错误
  return createProviderValue(state) as unknown as FormContextProps;
};

export function useFormContextSelctor<R>(selector: (state: FormContextProps) => R) {
  return createSelector(FormContext, selector);
}
