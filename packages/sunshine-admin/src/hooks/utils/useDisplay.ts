import { CSSProperties } from 'react';
import { useCreation } from 'ahooks';
import { isNil } from 'lodash-es';

export const useDisplay = (show?: boolean): CSSProperties => {
  return useCreation(() => {
    if (isNil(show)) return {};

    return show ? {} : { display: 'none' };
  }, [show]);
};
