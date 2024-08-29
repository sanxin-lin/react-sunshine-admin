import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { BasicColumn, BasicTableProps, TableActionType, TableRowSelection } from '../types/table';
import { RefObject } from 'react';
import { Nullable, Recordable } from '#/global';
import { FormActionType } from '@/components/Form';
import { useCreation } from 'ahooks';

// TODO useTableScroll
export const useTableScroll = (
  props: BasicTableProps,
  tableElRef: RefObject<TableActionType>,
  columns: BasicColumn[],
  rowSelection: Nullable<TableRowSelection>,
  dataSource: Recordable[],
  wrapRef: RefObject<Nullable<HTMLElement>>,
  formRef: RefObject<FormActionType>,
) => {
  const { getShowFooter, getFullContent } = useRootSetting();
  const scrollRef = useCreation(() => {
    return {} as BasicTableProps['scroll'];
  });
  const redoHeight = () => {};

  return {
    scrollRef,
    redoHeight,
  };
};
