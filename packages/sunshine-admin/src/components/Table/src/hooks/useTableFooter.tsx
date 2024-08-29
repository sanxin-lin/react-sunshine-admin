import { RefObject } from 'react';
import { BasicTableProps } from '../types/table';
import { Recordable } from '#/global';
import { useCreation, useMount } from 'ahooks';
import TableFooter from '../components/TableFooter';
import { nextTick } from '@/utils/dom';

export const useTableFooter = (
  props: BasicTableProps,
  scroll: BasicTableProps['scroll'],
  tableElRef: RefObject<any>,
  dataSource: Recordable[],
) => {
  const { summaryFunc, showSummary, summaryData } = props;
  const isEmptyData = dataSource.length === 0;

  const Footer = useCreation((): Recordable | undefined => {
    return showSummary && !isEmptyData
      ? () => <TableFooter summaryFunc={summaryFunc} summaryData={summaryData} scroll={scroll} />
      : undefined;
  }, [summaryFunc, showSummary, summaryData, isEmptyData, scroll]);

  const handleSummary = () => {
    if (!showSummary || isEmptyData) return;

    nextTick(() => {
      const tableEl = tableElRef.current;
      if (!tableEl) return;
      const bodyDom = tableEl.querySelector(' .ant-table-content,  .ant-table-body');
      // useEventListener({
      //   el: bodyDom,
      //   name: 'scroll',
      //   listener: () => {
      //     const footerBodyDom = tableEl.$el.querySelector(
      //       '.ant-table-footer .ant-table-container  [class^="ant-table-"]',
      //     ) as HTMLDivElement;
      //     if (!footerBodyDom || !bodyDom) return;
      //     footerBodyDom.scrollLeft = bodyDom.scrollLeft;
      //   },
      //   wait: 0,
      //   options: true,
      // });
    });
  };

  useMount(() => {
    handleSummary();
  });

  return {
    Footer,
  };
};
