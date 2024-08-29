import type { BasicTableProps, TableActionType, FetchParams, BasicColumn } from '../types/table';
import type { PaginationProps } from '../types/pagination';
import type { FormActionType } from '@/components/Form';
import { isProdMode } from '@/utils/env';
import { error } from '@/utils/log';
import type { Key } from 'antd/lib/table/interface';
import { useEffect, useRef } from 'react';
import { Nullable, Recordable } from '#/global';
import { useUnmount } from 'ahooks';

type UseTableMethod = TableActionType & {
  getForm: () => FormActionType;
};

export const useTable = (
  tableProps?: BasicTableProps,
): [
  (instance: TableActionType, formInstance: UseTableMethod) => void,
  TableActionType & {
    getForm: () => FormActionType;
  },
] => {
  const tableRef = useRef<Nullable<TableActionType>>(null);
  const loadedRef = useRef<Nullable<boolean>>(false);
  const formRef = useRef<Nullable<UseTableMethod>>(null);

  const register = (instance: TableActionType, formInstance: UseTableMethod) => {
    if (loadedRef.current && isProdMode() && instance === tableRef.current) return;

    tableRef.current = instance;
    formRef.current = formInstance;
    tableProps && instance.setProps(tableProps);
    loadedRef.current = true;
  };

  const getTableInstance = (): TableActionType => {
    const table = tableRef.current;
    if (!table) {
      error(
        'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!',
      );
    }
    return table as TableActionType;
  };

  useEffect(() => {
    tableProps && tableRef.current?.setProps(tableProps);
  }, [tableProps]);

  useUnmount(() => {
    tableRef.current = null;
    loadedRef.current = null;
  });

  const methods: TableActionType & {
    getForm: () => FormActionType;
  } = {
    reload: async (opt?: FetchParams) => {
      return await getTableInstance().reload(opt);
    },
    setProps: (props: Partial<BasicTableProps>) => {
      getTableInstance().setProps(props);
    },
    redoHeight: () => {
      getTableInstance().redoHeight();
    },
    setSelectedRows: (rows: Recordable[]) => {
      return getTableInstance().setSelectedRows(rows);
    },
    setLoading: (loading: boolean) => {
      getTableInstance().setLoading(loading);
    },
    getDataSource: () => {
      return getTableInstance().getDataSource();
    },
    getRawDataSource: () => {
      return getTableInstance().getRawDataSource();
    },
    getSearchInfo: () => {
      return getTableInstance().getSearchInfo();
    },
    getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
      const columns = getTableInstance().getColumns({ ignoreIndex }) || [];
      return columns;
    },
    setColumns: (columns: BasicColumn[] | string[]) => {
      getTableInstance().setColumns(columns);
    },
    setTableData: (values: any[]) => {
      return getTableInstance().setTableData(values);
    },
    setPagination: (info: Partial<PaginationProps>) => {
      return getTableInstance().setPagination(info);
    },
    deleteSelectRowByKey: (keyValue: Key) => {
      getTableInstance().deleteSelectRowByKey(keyValue);
    },
    getSelectRowKeys: () => {
      return getTableInstance().getSelectRowKeys();
    },
    getSelectRows: () => {
      return getTableInstance().getSelectRows();
    },
    clearSelectedRowKeys: () => {
      getTableInstance().clearSelectedRowKeys();
    },
    setSelectedRowKeys: (keyValues: Key[]) => {
      getTableInstance().setSelectedRowKeys(keyValues);
    },
    getPagination: () => {
      return getTableInstance().getPagination();
    },
    getSize: () => {
      return getTableInstance().getSize();
    },
    updateTableData: (index: number, key: string, value: any) => {
      return getTableInstance().updateTableData(index, key, value);
    },
    deleteTableDataRecord: (keyValues: Key | Key[]) => {
      return getTableInstance().deleteTableDataRecord(keyValues);
    },
    insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => {
      return getTableInstance().insertTableDataRecord(record, index);
    },
    updateTableDataRecord: (keyValue: Key, record: Recordable) => {
      return getTableInstance().updateTableDataRecord(keyValue, record);
    },
    findTableDataRecord: (keyValue: Key) => {
      return getTableInstance().findTableDataRecord(keyValue);
    },
    getRowSelection: () => {
      return getTableInstance().getRowSelection();
    },
    getCacheColumns: () => {
      return getTableInstance().getCacheColumns();
    },
    getForm: () => {
      return formRef.current as unknown as FormActionType;
    },
    setShowPagination: async (show: boolean) => {
      getTableInstance().setShowPagination(show);
    },
    getShowPagination: () => {
      return getTableInstance().getShowPagination();
    },
    expandAll: () => {
      getTableInstance().expandAll();
    },
    collapseAll: () => {
      getTableInstance().collapseAll();
    },
    expandRows: (keyValues: Key[]) => {
      getTableInstance().expandRows(keyValues);
    },
    collapseRows: (keyValues: Key[]) => {
      getTableInstance().collapseRows(keyValues);
    },
    scrollTo: (pos: string) => {
      getTableInstance().scrollTo(pos);
    },
  };

  return [register, methods];
};
