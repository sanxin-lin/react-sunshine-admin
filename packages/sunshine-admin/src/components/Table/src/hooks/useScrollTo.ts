import { Nullable, Recordable } from '#/global';
import { nextTick } from '@/utils/dom';
import { warn } from '@/utils/log';
import { RefObject, useRef } from 'react';

export const useTableScrollTo = (tableElRef: RefObject<any>, dataSource: Recordable[]) => {
  const bodyEl = useRef<Nullable<HTMLElement>>(null);

  const findTargetRowToScroll = async (targetRowData: Recordable) => {
    const { id } = targetRowData;
    const targetRowEl: HTMLElement | null | undefined = bodyEl.current?.querySelector(
      `[data-row-key="${id}"]`,
    );
    //Add a delay to get new dataSource
    await nextTick();
    bodyEl.current?.scrollTo({
      top: targetRowEl?.offsetTop ?? 0,
      behavior: 'smooth',
    });
  };

  const scrollTo = (pos: string): void => {
    const tableEle = tableElRef.current;
    if (!tableEle) return;

    if (!tableEle) {
      bodyEl.current = tableEle.querySelector('.ant-table-body');
      if (!bodyEl.current) return;
    }

    if (!dataSource) return;

    // judge pos type
    if (pos === 'top') {
      findTargetRowToScroll(dataSource[0]);
    } else if (pos === 'bottom') {
      findTargetRowToScroll(dataSource[dataSource.length - 1]);
    } else {
      const targetRowData = dataSource.find((data) => data.id === pos);
      if (targetRowData) {
        findTargetRowToScroll(targetRowData);
      } else {
        warn(`id: ${pos} doesn't exist`);
      }
    }
  };

  return { scrollTo };
};
