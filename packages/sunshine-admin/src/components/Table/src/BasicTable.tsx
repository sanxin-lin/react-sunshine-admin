import { useDesign } from '@/hooks/web/useDesign';
import './BasicTable.less';
import {
  // BasicColumn,
  BasicTableProps,
  ColumnChangeParam,
  InnerHandlers,
  InnerMethods,
  SizeType,
  TableActionType,
} from './types/table';
import { BasicForm, FormActionType, useForm } from '@/components/Form';
import { CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useCreation, useDebounceFn, useMount, useSize } from 'ahooks';
import { useLoading } from './hooks/useLoading';
import { usePagination } from './hooks/usePagination';
import { useRowSelection } from './hooks/useRowSelection';
import { useDataSource } from './hooks/useDataSource';
import { useColumns } from './hooks/useColumns';
import { useTableScroll } from './hooks/useTableScroll';
import { useTableScrollTo } from './hooks/useScrollTo';
import { useCustomRow } from './hooks/useCustomRow';
import { useTableStyle } from './hooks/useTableStyle';
import { useTableExpand } from './hooks/useTableExpand';
import { useTableHeader } from './hooks/useTableHeader';
import { useTableFooter } from './hooks/useTableFooter';
import { useTableForm } from './hooks/useTableForm';
import { omit } from 'lodash-es';
import classNames from 'classnames';
import { createTableProviderValue, TableContext } from './hooks/useTableContext';
import { Table } from 'antd';
import { DEFAULT_FILTER_FN, DEFAULT_SIZE, DEFAULT_SORT_FN, FETCH_SETTING } from './const';

const BasicTable = forwardRef<TableActionType, BasicTableProps>((props, ref) => {
  const [innerProps, setInnerProps] = useState<Partial<BasicTableProps>>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<FormActionType>(null);
  const tableRef = useRef(null);
  const [tableData, setTableDataState] = useState<any[]>([]);
  const { prefixCls } = useDesign('basic-table');
  const [registerForm, formActions] = useForm();
  const { height } = useSize(wrapRef) ?? {};

  const propsCreation = useCreation(() => {
    return {
      // 默认值
      clickToRowSelect: true,
      tableSetting: {},
      sortFn: DEFAULT_SORT_FN,
      filterFn: DEFAULT_FILTER_FN,
      autoCreateKey: true,
      striped: true,
      indentSize: 24,
      canColDrag: true,
      fetchSetting: FETCH_SETTING,
      immediate: true,
      emptyDataIsShowTable: true,
      // columns: [] as BasicColumn[],
      showIndexColumn: true,
      ellipsis: true,
      isCanResizeParent: false,
      canResize: true,
      resizeHeightOffset: 0,
      rowKey: '',
      size: DEFAULT_SIZE,
      ...props,
      ...innerProps,
    } as BasicTableProps;
  }, [props, innerProps]);

  const { loading, setLoading } = useLoading(propsCreation.loading);
  const { paginationInfo, getPaginationInfo, setPagination, setShowPagination, getShowPagination } =
    usePagination(propsCreation.pagination);
  const {
    getRowSelection,
    rowSelection,
    getSelectRows,
    setSelectedRows,
    clearSelectedRowKeys,
    getSelectRowKeys,
    deleteSelectRowByKey,
    setSelectedRowKeys,
  } = useRowSelection(propsCreation, tableData, propsCreation.onSelectionChange);
  const {
    handleTableChange: onTableChange,
    dataSource,
    getDataSource,
    getRawDataSource,
    getSearchInfo,
    setTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    fetch,
    rowKey,
    reload,
    autoCreateKey,
    updateTableData,
  } = useDataSource(propsCreation, {
    setTableData: setTableDataState,
    paginationInfo,
    setLoading,
    setPagination,
    getFieldsValue: formActions.getFieldsValue,
    clearSelectedRowKeys,
    onFetchSuccess: propsCreation.onFetchSuccess,
    onFetchError: propsCreation.onFetchError,
  });

  const {
    visibleColumns,
    getColumns,
    setCacheColumnsByField,
    setCacheColumns,
    // TODO setColumnWidth
    // setColumnWidth,
    setColumns,
    columns,
    getCacheColumns,
  } = useColumns(propsCreation, paginationInfo);

  const { scrollRef, redoHeight } = useTableScroll(
    propsCreation,
    tableRef,
    columns,
    rowSelection,
    dataSource,
    wrapRef,
    formRef,
  );
  const { run: debounceRedoHeight } = useDebounceFn(redoHeight, {
    wait: 50,
  });
  const { scrollTo } = useTableScrollTo(tableRef, dataSource);

  const handleTableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    onTableChange(pagination, filters, sorter);
    propsCreation.onChange?.(pagination, filters, sorter, extra);
  };

  const { customRow } = useCustomRow(propsCreation, {
    setSelectedRowKeys,
    getSelectRowKeys,
    clearSelectedRowKeys,
    autoCreateKey,
  });

  const { getRowClassName } = useTableStyle(propsCreation, prefixCls);

  const { expandOption, expandAll, expandRows, collapseRows, collapseAll, handleTableExpand } =
    useTableExpand(propsCreation, tableData);

  const handlers: InnerHandlers = {
    onColumnsChange: (data: ColumnChangeParam[]) => {
      props.onColumnsChange?.(data);
    },
  };

  const methods: InnerMethods = {
    clearSelectedRowKeys,
    getSelectRowKeys,
  };

  const { headerProps } = useTableHeader(propsCreation, handlers, methods);

  const { Footer } = useTableFooter(propsCreation, scrollRef, tableRef, dataSource);

  const { formProps, handleSearchInfoChange } = useTableForm(propsCreation, fetch, loading);

  const wrapperClass = useCreation(() => {
    const { className, useSearchForm, inset } = propsCreation;
    return classNames(prefixCls, className, {
      [`${prefixCls}-form-container`]: useSearchForm,
      [`${prefixCls}--inset`]: inset,
    });
  }, [propsCreation]);

  const emptyDataIsShowTable = useCreation(() => {
    const { emptyDataIsShowTable, useSearchForm } = propsCreation;
    if (emptyDataIsShowTable || !useSearchForm) {
      return true;
    }
    return !!dataSource.length;
  }, [propsCreation, dataSource]);

  const bindValues = useCreation(() => {
    const style: CSSProperties = emptyDataIsShowTable ? {} : { display: 'none' };
    let propsData: any = {
      customRow,
      ...propsCreation,
      ...headerProps,
      scroll: scrollRef,
      loading,
      tableLayout: 'fixed',
      rowSelection,
      rowKey: rowKey,
      columns: visibleColumns,
      pagination: paginationInfo,
      dataSource,
      footer: Footer,
      ...expandOption,
      style: propsCreation.style ? { ...propsCreation.style, ...style } : style,
    };

    propsData = omit(propsData, ['class', 'onChange']);
    return propsData;
  }, [
    dataSource,
    propsCreation,
    headerProps,
    loading,
    scrollRef,
    rowSelection,
    visibleColumns,
    rowKey,
    paginationInfo,
    Footer,
    expandOption,
    emptyDataIsShowTable,
  ]);

  useEffect(() => {
    propsCreation.canResize && debounceRedoHeight();
  }, [height, propsCreation.canResize]);

  const setProps = (inputProps: Partial<BasicTableProps>) => {
    setInnerProps((pre) => ({ ...pre, ...inputProps }));
  };

  const tableAction: TableActionType = {
    tableRef,
    reload,
    getSelectRows,
    setSelectedRows,
    clearSelectedRowKeys,
    getSelectRowKeys,
    deleteSelectRowByKey,
    setPagination,
    setTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    redoHeight,
    setSelectedRowKeys,
    setColumns,
    setLoading,
    getDataSource,
    getRawDataSource,
    getSearchInfo,
    setProps,
    getRowSelection,
    getPagination: getPaginationInfo,
    getColumns,
    getCacheColumns,
    updateTableData,
    setShowPagination,
    getShowPagination,
    setCacheColumnsByField,
    expandAll,
    collapseAll,
    expandRows,
    collapseRows,
    scrollTo,
    getSize: () => {
      return bindValues.size as SizeType;
    },
    setCacheColumns,
  };

  const contextValue = createTableProviderValue(
    useCreation(
      () => ({
        ...tableAction,
        wrapRef,
        allProps: bindValues,
      }),
      [bindValues, wrapRef],
    ),
  );

  useImperativeHandle(ref, () => ({
    ...tableAction,
  }));

  useMount(() => {
    props.register?.(tableAction, formActions);
  });

  return (
    <TableContext.Provider value={contextValue}>
      <div ref={wrapRef} className={wrapperClass}>
        {propsCreation.useSearchForm && (
          <BasicForm
            ref={formRef}
            submitOnReset
            tableAction={tableAction}
            register={registerForm}
            onSubmit={handleSearchInfoChange}
            onAdvancedChange={redoHeight}
            {...formProps}
          />
        )}

        <Table
          ref={tableRef}
          {...bindValues}
          onChange={handleTableChange}
          expandable={{ onExpand: handleTableExpand }}
          rowClassName={getRowClassName}
        />
      </div>
    </TableContext.Provider>
  );
});

export default BasicTable;
