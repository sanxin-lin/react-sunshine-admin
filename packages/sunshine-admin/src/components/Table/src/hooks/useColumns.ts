import { cloneDeep, isArray, isBoolean, isEqual, isFunction, isMap, isString } from 'lodash-es';
import { ACTION_COLUMN_FLAG, DEFAULT_ALIGN, INDEX_COLUMN_FLAG, PAGE_SIZE } from '../const';
import { BasicColumn, BasicTableProps, CellFormat, GetColumnsParams } from '../types/table';
import { useLocale } from '@/hooks/web/useLocale';
import { useEffect, useRef } from 'react';
import type { PaginationProps } from '../types/pagination';
import { useCreation } from 'ahooks';
import { usePermission } from '@/hooks/web/usePermission';
import { Recordable } from '#/global';
import { formatToDate } from '@/utils/date';
import { ColumnType } from 'antd/lib/table';
import { useGetState } from '@/hooks/utils/useGetState';

export const useColumns = (props: BasicTableProps, pagination: PaginationProps | boolean) => {
  const {
    showIndexColumn,
    indexColumnProps,
    isTreeTable,
    ellipsis,
    actionColumn,
    columns: propsColumns,
  } = props;
  const { hasPermission } = usePermission();
  const [columns, setColumns, getColumns] = useGetState(props.columns);
  const cacheColumns = useRef(props.columns);
  const { t } = useLocale();

  // useEffect(() => {
  //   columns.forEach((item) => {
  //     const { render } = item;

  //     handleItem(item, Reflect.has(item, 'ellipsis') ? !!item.ellipsis : !!ellipsis && !render);
  //   });
  //   setColumns([...columns]);
  // }, [ellipsis]);

  // useEffect(() => {
  //   handleActionColumn(actionColumn, columns);
  //   setColumns([...columns]);
  // }, [actionColumn]);

  // useEffect(() => {
  //   handleIndexColumn(
  //     { isTreeTable, indexColumnProps, showIndexColumn },
  //     pagination,
  //     propsColumns,
  //     t,
  //   );
  //   setColumns([...propsColumns]);
  // }, [propsColumns]);

  useEffect(() => {
    const _propsColumns = cloneDeep(propsColumns);
    _propsColumns.forEach((item) => {
      const { render } = item;

      handleItem(item, Reflect.has(item, 'ellipsis') ? !!item.ellipsis : !!ellipsis && !render);
    });
    handleActionColumn(actionColumn, _propsColumns);
    handleIndexColumn(
      { isTreeTable, indexColumnProps, showIndexColumn },
      pagination,
      _propsColumns,
      t,
    );
    setColumns(_propsColumns);
    cacheColumns.current = propsColumns?.filter((item) => !item.flag) ?? [];
  }, [
    isTreeTable,
    indexColumnProps,
    showIndexColumn,
    pagination,
    t,
    propsColumns,
    actionColumn,
    ellipsis,
  ]);

  const isIfShow = (column: BasicColumn): boolean => {
    const ifShow = column.ifShow;
    let isIfShow = true;

    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(column);
    }
    return isIfShow;
  };

  const visibleColumns = useCreation(() => {
    const viewColumns = sortFixedColumn(columns);
    const mapFn = (column: BasicColumn) => {
      const { render, format, edit, editRow, flag } = column;

      const isDefaultAction = [INDEX_COLUMN_FLAG, ACTION_COLUMN_FLAG].includes(flag!);
      if (!render && format && !edit && !isDefaultAction) {
        column.render = ({ text, record, index }) => {
          return formatCell(text, format, record, index);
        };
      }

      // edit table
      if ((edit || editRow) && !isDefaultAction) {
        // TODO renderEditCell
        // column.render = renderEditCell(column);
      }
      return column;
    };

    const _columns = [...viewColumns];
    return _columns
      .filter((column) => hasPermission(column.auth) && isIfShow(column))
      .map((column) => {
        // Support table multiple header editable
        if (column.children?.length) {
          column.children = column.children.map(mapFn);
        }

        return mapFn(column);
      });
  }, [columns]);

  const setCacheColumnsByField = (dataIndex: string | undefined, value: Partial<BasicColumn>) => {
    if (!dataIndex || !value) {
      return;
    }
    cacheColumns.current.forEach((item) => {
      if (item.dataIndex === dataIndex) {
        Object.assign(item, value);
        return;
      }
    });
  };

  /**
   * set columns
   * @param columnList key｜column
   */
  const setColumnsFn = (columnList: Partial<BasicColumn>[] | (string | string[])[]) => {
    const _columns = [...columnList];
    if (!isArray(_columns)) return;

    if (_columns.length <= 0) {
      setColumns([]);
      return;
    }

    const firstColumn = _columns[0];

    const cacheKeys = cacheColumns.current.map((item) => item.dataIndex);

    if (!isString(firstColumn) && !isArray(firstColumn)) {
      setColumns(_columns as BasicColumn[]);
    } else {
      const columnKeys = (_columns as (string | string[])[]).map((m) => m.toString());
      const newColumns: BasicColumn[] = [];
      cacheColumns.current.forEach((item) => {
        newColumns.push({
          ...item,
          defaultHidden: !columnKeys.includes(item.dataIndex?.toString() || (item.key as string)),
        });
      });
      // Sort according to another array
      if (!isEqual(cacheKeys, _columns)) {
        newColumns.sort((prev, next) => {
          return (
            columnKeys.indexOf(prev.dataIndex?.toString() as string) -
            columnKeys.indexOf(next.dataIndex?.toString() as string)
          );
        });
      }
      setColumns(newColumns);
    }
  };

  const getColumnsFn = (opt?: GetColumnsParams) => {
    const { ignoreIndex, ignoreAction, sort } = opt || {};
    let _columns = [...getColumns()];
    if (ignoreIndex) {
      _columns = _columns.filter((item) => item.flag !== INDEX_COLUMN_FLAG);
    }
    if (ignoreAction) {
      _columns = _columns.filter((item) => item.flag !== ACTION_COLUMN_FLAG);
    }

    if (sort) {
      _columns = sortFixedColumn(_columns);
    }

    return _columns;
  };
  function getCacheColumns() {
    return cacheColumns.current;
  }
  function setCacheColumns(columns: BasicColumn[]) {
    if (!isArray(columns)) return;
    cacheColumns.current = columns.filter((item) => !item.flag);
  }
  /**
   * 拖拽列宽修改列的宽度
   */
  function setColumnWidth(w: number, col: ColumnType<BasicColumn>) {
    col.width = w;
  }
  return {
    columns,
    getCacheColumns,
    getColumns: getColumnsFn,
    setColumns: setColumnsFn,
    setColumnWidth,
    visibleColumns,
    setCacheColumnsByField,
    setCacheColumns,
  };
};
const sortFixedColumn = (columns: BasicColumn[]) => {
  const fixedLeftColumns: BasicColumn[] = [];
  const fixedRightColumns: BasicColumn[] = [];
  const defColumns: BasicColumn[] = [];
  for (const column of columns) {
    if (column.fixed === 'left') {
      fixedLeftColumns.push(column);
      continue;
    }
    if (column.fixed === 'right') {
      fixedRightColumns.push(column);
      continue;
    }
    defColumns.push(column);
  }
  // 筛选逻辑
  const filterFunc = (item) => !item.defaultHidden;
  // 筛选首层显示列（1级表头）
  const _columns = [...fixedLeftColumns, ...defColumns, ...fixedRightColumns].filter(filterFunc);
  // 筛选>=2级表头（深度优先）
  const list = [..._columns];
  while (list.length) {
    const current = list[0];
    if (Array.isArray(current.children)) {
      current.children = current.children.filter(filterFunc);
      list.shift();
      list.unshift(...current.children);
    } else {
      list.shift();
    }
  }
  return _columns;
};

const handleItem = (item: BasicColumn, ellipsis: boolean) => {
  const { key, dataIndex, children } = item;
  item.align = item.align || DEFAULT_ALIGN;
  if (ellipsis) {
    if (!key) {
      item.key = typeof dataIndex == 'object' ? dataIndex.join('-') : dataIndex;
    }
    if (!isBoolean(item.ellipsis)) {
      Object.assign(item, {
        ellipsis,
      });
    }
  }
  if (children && children.length) {
    handleChildren(children, !!ellipsis);
  }
};

const handleChildren = (children: BasicColumn[] | undefined, ellipsis: boolean) => {
  if (!children) return;
  children.forEach((item) => {
    const { children } = item;
    handleItem(item, ellipsis);
    handleChildren(children, ellipsis);
  });
};

const handleActionColumn = (actionColumn: any, columns: BasicColumn[]) => {
  if (!actionColumn) return;

  const hasIndex = columns.findIndex((column) => column.flag === ACTION_COLUMN_FLAG);
  if (hasIndex === -1) {
    columns.push({
      ...columns[hasIndex],
      fixed: 'right',
      ...actionColumn,
      flag: ACTION_COLUMN_FLAG,
    });
  }
};

const handleIndexColumn = (
  props: Pick<BasicTableProps, 'isTreeTable' | 'showIndexColumn' | 'indexColumnProps'>,
  pagination: PaginationProps | boolean,
  columns: BasicColumn[],
  t: any,
) => {
  const { isTreeTable, showIndexColumn, indexColumnProps } = props;
  let pushIndexColumns = false;
  if (isTreeTable) {
    return;
  }
  columns.forEach(() => {
    const indIndex = columns.findIndex((column) => column.flag === INDEX_COLUMN_FLAG);
    if (showIndexColumn) {
      pushIndexColumns = indIndex === -1;
    } else if (!showIndexColumn && indIndex !== -1) {
      columns.splice(indIndex, 1);
    }
  });
  if (!pushIndexColumns) return;

  const isFixedLeft = columns.some((item) => item.fixed === 'left');

  columns.unshift({
    flag: INDEX_COLUMN_FLAG,
    width: 60,
    title: t('component.table.index'),
    align: 'center',
    render: (_, __, index) => {
      if (isBoolean(pagination)) {
        return `${index + 1}`;
      }
      const { current = 1, pageSize = PAGE_SIZE } = pagination;
      return ((current < 1 ? 1 : current) - 1) * pageSize + index + 1;
    },
    ...(isFixedLeft
      ? {
          fixed: 'left',
        }
      : {}),
    ...indexColumnProps,
  });
};

// format cell
const formatCell = (text: string, format: CellFormat, record: Recordable, index: number) => {
  if (!format) {
    return text;
  }

  // custom function
  if (isFunction(format)) {
    return format(text, record, index);
  }

  try {
    // date type
    const DATE_FORMAT_PREFIX = 'date|';
    if (isString(format) && format.startsWith(DATE_FORMAT_PREFIX) && text) {
      const dateFormat = format.replace(DATE_FORMAT_PREFIX, '');

      if (!dateFormat) {
        return text;
      }
      return formatToDate(text, dateFormat);
    }

    // Map
    if (isMap(format)) {
      return format.get(text);
    }
  } catch (error) {
    return text;
  }
};
