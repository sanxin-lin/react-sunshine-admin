import { useDebounceFn, useMount, useUnmount } from 'ahooks';

import type { AnyFunction } from '#/global';

export interface UseWindowSizeOptions {
  wait?: number;
  once?: boolean;
  immediate?: boolean;
  listenerOptions?: AddEventListenerOptions | boolean;
}

export const useWindowSize = (fn: AnyFunction, options: UseWindowSizeOptions = {}) => {
  const { wait = 150, immediate } = options;
  let handler: any = () => {
    fn();
  };
  const { run: handleSize } = useDebounceFn(handler, {
    wait,
  });
  handler = handleSize;

  const start = () => {
    if (immediate) {
      handler();
    }
    window.addEventListener('resize', handler);
  };

  const stop = () => {
    window.removeEventListener('resize', handler);
  };

  useMount(() => {
    start();
  });

  useUnmount(() => {
    stop();
  });
  return { start, stop };
};
