import { useUnmount } from 'ahooks';

import { isPascalCase } from '@/utils/is';

import { add, del } from '../componentMap';

export const useComponentRegister = (name: string, component: any) => {
  if (!isPascalCase(name)) {
    throw new Error('compName must be in PascalCase');
  }

  add(name, component);
  useUnmount(() => {
    del(name);
  });
};
