import { useCreation } from 'ahooks';
import { TableFooterProps } from '../types/table';
import { parseRowKey } from '../helper';
import { isFunction } from 'lodash-es';
import { useTableContextSelctor } from '../hooks/useTableContext';
import { INDEX_COLUMN_FLAG } from '../const';
import { ColumnType } from 'antd/lib/table';
import { Table } from 'antd';

const SUMMARY_ROW_KEY = '_row';
const SUMMARY_INDEX_KEY = '_index';

const TableFooter = (props: TableFooterProps) => {
  const { summaryFunc = null, summaryData = null, scroll, rowKey = '' } = props;
  const { getDataSource, getRowSelection, getColumns } = useTableContextSelctor((state) => ({
    getDataSource: state.getDataSource,
    getRowSelection: state.getRowSelection,
    getColumns: state.getColumns,
  }));
  const dataSource = useCreation(() => {
    if (summaryData?.length) {
      const _summaryData = [...summaryData];
      _summaryData.forEach((item, index) => {
        item[parseRowKey(rowKey, item)] = String(index);
      });
      return _summaryData;
    }

    if (!isFunction(summaryFunc)) return [];

    const _dataSource = [...getDataSource()];
    _dataSource.forEach((item, index) => {
      item[parseRowKey(rowKey, item)] = String(index);
    });
    return _dataSource;
  }, [summaryData, summaryFunc]);

  const columns = useCreation(() => {
    const _columns = [...getColumns()];
    const target = _columns.find((column) => column.flag === INDEX_COLUMN_FLAG);
    const hasRowSummary = dataSource.some((item) => Reflect.has(item, SUMMARY_ROW_KEY));
    const hasIndexSummary = dataSource.some((item) => Reflect.has(item, SUMMARY_INDEX_KEY));

    if (target) {
      if (hasIndexSummary) {
        target.render = (_, record) => record[SUMMARY_INDEX_KEY];
        target.ellipsis = false;
      } else {
        Reflect.deleteProperty(target, 'render');
      }
    }

    if (getRowSelection() && hasRowSummary) {
      const isFixed = _columns.some((col) => col.fixed === 'left');
      _columns.unshift({
        width: 60,
        title: 'selection',
        key: 'selectionKey',
        align: 'center',
        ...(isFixed ? { fixed: 'left' } : {}),
        render: ({ record }) => record[SUMMARY_ROW_KEY],
      });
    }

    return columns as unknown as ColumnType<any>[];
  }, [dataSource]);

  if (!summaryFunc || !summaryData) return null;

  return (
    <Table
      showHeader={false}
      bordered={false}
      pagination={false}
      dataSource={dataSource}
      rowKey={String(rowKey)}
      columns={columns}
      tableLayout="fixed"
      scroll={scroll}
    />
  );
};

export default TableFooter;
