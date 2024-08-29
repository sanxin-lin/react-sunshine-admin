import { useMount, useUnmount } from 'ahooks';

import { mitt } from '@/utils/mitt';

import { useGo } from './usePage';

export type MenuEmitterEvents = {
  'out-navigate': {
    path: string;
    replace?: boolean;
  };
};

export const routerEmitter = mitt<MenuEmitterEvents>();

export const useRouterEmitterEvents = () => {
  const go = useGo();
  useMount(() => {
    // 外部跳转路由订阅事件
    routerEmitter.on('out-navigate', (params) => {
      const { path, replace = false } = params;

      go(path, replace);
    });
  });

  useUnmount(() => {
    routerEmitter.clear();
  });
};
