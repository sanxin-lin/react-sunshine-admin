import { createContext } from 'react';

interface IPageWrapperContext {
  fixedHeight: boolean;
}

export const PageWrapperContext = createContext({} as IPageWrapperContext);
