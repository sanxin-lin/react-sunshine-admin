import type { Options } from 'sortablejs';
import { Nullable } from '#/global';
import { nextTick } from '@/utils/dom';
import { RefObject } from 'react';

export function useSortable(el: RefObject<Nullable<HTMLElement>>, options?: Options) {
  function initSortable() {
    nextTick(async () => {
      if (!el.current) return;

      const Sortable = (await import('sortablejs')).default;
      Sortable.create(el.current, {
        animation: 100,
        delay: 400,
        delayOnTouchOnly: true,
        ...options,
      });
    });
  }

  return { initSortable };
}
