import { createContext } from 'react';

import { createProviderValue, createSelector } from '@/hooks/utils/useContext';

interface ContentContextProps {
  contentHeight: number;
  setPageHeight: (height: number) => void;
  pageHeight: number;
}

export const ContentContext = createContext<ContentContextProps>({} as ContentContextProps);

export const createContentProviderValue = <S>(state: S) => {
  // 修改类型，否则传 RootMenuContext.Provider 的时候会报类型错误
  return createProviderValue(state) as unknown as ContentContextProps;
};

export function useContentContextSelctor<R>(selector: (state: ContentContextProps) => R) {
  return createSelector(ContentContext, selector);
}
