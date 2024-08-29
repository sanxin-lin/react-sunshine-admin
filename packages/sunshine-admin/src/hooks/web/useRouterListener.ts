import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useRouterMatched } from './useRouterMatched';

export const useRouterListener = (fn?: (matched: ReturnType<typeof useRouterMatched>) => void) => {
  const matched = useRouterMatched();
  // 获取当前url
  const { pathname } = useLocation();

  useEffect(() => {
    fn?.(matched);
  }, [pathname]);

  return {};
};
