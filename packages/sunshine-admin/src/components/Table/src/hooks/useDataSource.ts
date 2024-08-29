import type { BasicTableProps, FetchParams, SorterResult } from '../types/table';
import { Recordable } from '#/global';
import type { PaginationProps } from '../types/pagination';
import { useCreation, useGetState, useReactive } from 'ahooks';
import { useEffect } from 'react';
import { get, isBoolean, isFunction, isPlainObject, merge } from 'lodash-es';
import { FETCH_SETTING, PAGE_SIZE, ROW_KEY } from '../const';
import { buildUUID } from '@/utils/uuid';
import { Key } from 'antd/lib/table/interface';
import { parseRowKeyValue } from '../helper';

interface ActionType {
  paginationInfo: boolean | PaginationProps;
  setPagination: (info: Partial<PaginationProps>) => void;
  setLoading: (loading: boolean) => void;
  getFieldsValue: () => Recordable;
  clearSelectedRowKeys: () => void;
  setTableData: (data: Recordable[]) => void;
  onFetchSuccess: BasicTableProps['onFetchSuccess'];
  onFetchError?: BasicTableProps['onFetchError'];
}

interface SearchState {
  sortInfo: Recordable;
  filterInfo: Record<string, string[]>;
}

export const useDataSource = (
  props: BasicTableProps,
  {
    paginationInfo,
    setPagination,
    setLoading,
    getFieldsValue,
    clearSelectedRowKeys,
    setTableData: inputSetTableData,
    onFetchError,
    onFetchSuccess,
  }: ActionType,
) => {
  const searchState = useReactive<SearchState>({
    sortInfo: {},
    filterInfo: {},
  });
  const {
    dataSource: propsDataSource,
    api,
    clearSelectOnPageChange,
    sortFn,
    filterFn,
    searchInfo: propsSearchInfo,
    defSort,
    fetchSetting,
    beforeFetch,
    afterFetch,
    useSearchForm,
    pagination,
    autoCreateKey,
    rowKey,
    childrenColumnName = 'children',
  } = props;
  const [dataSource, setDataSource, getDataSource] = useGetState<Recordable[]>([]);
  const [, setRawDataSource, getRawDataSource] = useGetState<Recordable>({});
  const [searchInfo, setSearchInfo, getSearchInfo] = useGetState<Recordable>({});

  useEffect(() => {
    inputSetTableData([...dataSource]);
  }, [dataSource]);

  useEffect(() => {
    if (!api && propsDataSource) {
      setDataSource([...propsDataSource]);
    }
  }, [propsDataSource, api]);

  const autoCreateKeyCreation = useCreation(() => {
    return !!autoCreateKey && !rowKey;
  }, [autoCreateKey, rowKey]);

  const rowKeyCreation = useCreation(() => {
    return autoCreateKeyCreation ? ROW_KEY : rowKey;
  }, [autoCreateKeyCreation, rowKey]);

  useEffect(() => {
    if (autoCreateKeyCreation) {
      const firstItem = dataSource[0];
      const lastItem = dataSource[dataSource.length - 1];

      if (firstItem && lastItem) {
        if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
          const data = [...dataSource];
          data.forEach((item) => {
            if (!item[ROW_KEY]) {
              item[ROW_KEY] = buildUUID();
            }
            if (item.children && item.children.length) {
              setTableKey(item.children);
            }
          });
          setDataSource(data);
        }
      }
    }
  }, [autoCreateKeyCreation]);

  const handleTableChange = (
    pagination: PaginationProps,
    filters: Partial<Recordable<string[]>>,
    sorter: SorterResult,
  ) => {
    if (clearSelectOnPageChange) {
      clearSelectedRowKeys();
    }
    setPagination(pagination);

    const params: Recordable = {};
    if (sorter && isFunction(sortFn)) {
      const sortInfo = sortFn(sorter);
      searchState.sortInfo = sortInfo;
      params.sortInfo = sortInfo;
    }

    if (filters && isFunction(filterFn)) {
      const filterInfo = filterFn(filters);
      searchState.filterInfo = filterInfo;
      params.filterInfo = filterInfo;
    }
    fetch(params);
  };

  const setTableKey = (items: any[]) => {
    if (!items || !Array.isArray(items)) return;
    items.forEach((item) => {
      if (!item[ROW_KEY]) {
        item[ROW_KEY] = buildUUID();
      }
      if (item.children && item.children.length) {
        setTableKey(item.children);
      }
    });
  };

  const updateTableData = async (index: number, key: Key, value: any) => {
    const record = dataSource[index];
    if (record) {
      record[key as string] = value;
      setDataSource([...dataSource]);
    }
    return record;
  };

  const updateTableDataRecord = async (
    keyValue: Key,
    record: Recordable,
  ): Promise<Recordable | undefined> => {
    const row = findTableDataRecord(keyValue);

    if (row) {
      for (const field in row) {
        if (Reflect.has(record, field)) row[field] = record[field];
      }
      setDataSource([...dataSource]);
      return row;
    }
  };

  const deleteTableDataRecord = (keyValues: Key | Key[]) => {
    if (!dataSource || dataSource.length == 0) return;
    const delKeyValues = !Array.isArray(keyValues) ? [keyValues] : keyValues;

    function deleteRow(data, keyValue) {
      const row: { index: number; data: [] } = findRow(data, keyValue);
      if (row === null || row.index === -1) {
        return;
      }
      row.data.splice(row.index, 1);

      function findRow(data, keyValue) {
        if (data === null || data === undefined) {
          return null;
        }
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          if (parseRowKeyValue(rowKeyCreation, row) === keyValue) {
            return { index: i, data };
          }
          if (row.children?.length > 0) {
            const result = findRow(row.children, keyValue);
            if (result != null) {
              return result;
            }
          }
        }
        return null;
      }
    }

    for (const keyValue of delKeyValues) {
      deleteRow(dataSource, keyValue);
    }
    setDataSource([...dataSource]);
    setPagination({
      total: dataSource?.length,
    });
  };

  function insertTableDataRecord(
    record: Recordable | Recordable[],
    index?: number,
  ): Recordable[] | undefined {
    // if (!dataSource || dataSource.length == 0) return;
    index = index ?? dataSource?.length;
    const _record = isPlainObject(record) ? [record as Recordable] : (record as Recordable[]);
    dataSource.splice(index, 0, ..._record);
    setDataSource([...dataSource]);
    return getDataSource();
  }

  function findTableDataRecord(keyValue: Key) {
    if (!dataSource || dataSource.length === 0) return;

    const findRow = (array: any[]) => {
      let ret;
      array.some(function iter(r) {
        if (parseRowKeyValue(rowKeyCreation, r) === keyValue) {
          ret = r;
          return true;
        }
        return r[childrenColumnName] && r[childrenColumnName].some(iter);
      });
      return ret;
    };

    return findRow(dataSource);
  }

  const fetch = async (opt?: FetchParams) => {
    if (!api || !isFunction(api)) return;
    try {
      setLoading(true);
      const { pageField, sizeField, listField, totalField } = Object.assign(
        {},
        FETCH_SETTING,
        fetchSetting,
      );
      let pageParams: Recordable = {};

      const { current = 1, pageSize = PAGE_SIZE } = paginationInfo as PaginationProps;

      if ((isBoolean(pagination) && !pagination) || isBoolean(paginationInfo)) {
        pageParams = {};
      } else {
        pageParams[pageField] = (opt && opt.page) || current;
        pageParams[sizeField] = pageSize;
      }

      const { sortInfo = {}, filterInfo } = searchState;

      let params: Recordable = merge(
        pageParams,
        useSearchForm ? getFieldsValue() : {},
        propsSearchInfo,
        opt?.searchInfo ?? {},
        defSort,
        sortInfo,
        filterInfo,
        opt?.sortInfo ?? {},
        opt?.filterInfo ?? {},
      );
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      setSearchInfo(params);
      const res = await api(params);
      setRawDataSource(res);

      const isArrayResult = Array.isArray(res);

      let resultItems: Recordable[] = isArrayResult ? res : get(res, listField);
      const resultTotal: number = isArrayResult ? res.length : get(res, totalField);

      // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
      if (Number(resultTotal)) {
        const currentTotalPage = Math.ceil(resultTotal / pageSize);
        if (current > currentTotalPage) {
          setPagination({
            current: currentTotalPage,
          });
          return await fetch(opt);
        }
      }

      if (afterFetch && isFunction(afterFetch)) {
        resultItems = (await afterFetch(resultItems)) || resultItems;
      }
      setDataSource(resultItems);
      setPagination({
        total: resultTotal || 0,
      });
      if (opt && opt.page) {
        setPagination({
          current: opt.page || 1,
        });
      }
      onFetchSuccess?.({
        items: resultItems,
        total: resultTotal,
      });
      return resultItems;
    } catch (error) {
      onFetchError?.(error);
      setDataSource([]);
      setPagination({
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const setTableData = <T = Recordable>(values: T[]) => {
    setDataSource(values as Recordable[]);
  };

  function getDataSourceFn<T = Recordable>() {
    return getDataSource() as T[];
  }

  function getRawDataSourceFn<T = Recordable>() {
    return getRawDataSource() as T;
  }

  async function reload(opt?: FetchParams) {
    return await fetch(opt);
  }

  function getSearchInfoFn<T = Recordable>() {
    return getSearchInfo() as T;
  }

  //   onMounted(() => {
  //     useTimeoutFn(() => {
  //       unref(propsRef).immediate && fetch();
  //     }, 16);
  //   });
  return {
    dataSource,
    getDataSource: getDataSourceFn,
    getRawDataSource: getRawDataSourceFn,
    searchInfo,
    getSearchInfo: getSearchInfoFn,
    rowKey: rowKeyCreation,
    setTableData,
    autoCreateKey: autoCreateKeyCreation,
    fetch,
    reload,
    updateTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    handleTableChange,
  };
};
