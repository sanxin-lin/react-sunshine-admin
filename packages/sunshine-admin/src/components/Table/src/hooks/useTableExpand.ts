import { Recordable } from '#/global';
import { useState } from 'react';
import { BasicTableProps } from '../types/table';
import { Key } from 'antd/lib/table/interface';
import { useCreation } from 'ahooks';
import { ROW_KEY } from '../const';
import { parseRowKeyValue } from '../helper';
import { nextTick } from '@/utils/dom';

export const useTableExpand = (props: BasicTableProps, tableData: Recordable[]) => {
  const {
    autoCreateKey,
    rowKey,
    isTreeTable,
    expandRowByClick,
    onExpandedRowsChange,
    childrenColumnName,
    accordion,
  } = props;

  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);

  const autoCreateKeyCreation = useCreation(() => {
    return !!autoCreateKey && !rowKey;
  }, [autoCreateKey, rowKey]);

  const rowKeyCreation = useCreation(() => {
    return autoCreateKeyCreation ? ROW_KEY : rowKey;
  }, [autoCreateKeyCreation, rowKey]);

  const expandOptionCreation = useCreation(() => {
    if (!isTreeTable && !expandRowByClick) return {};

    return {
      expandedRowKeys,
      onExpandedRowsChange: (keyValues: string[]) => {
        setExpandedRowKeys(keyValues);
        onExpandedRowsChange?.(keyValues);
      },
    };
  }, [isTreeTable, expandRowByClick, onExpandedRowsChange]);

  const expandAll = () => {
    const keyValues = getAllKeys();
    setExpandedRowKeys(keyValues);
  };

  function collapseAll() {
    setExpandedRowKeys([]);
  }

  const expandRows = (keyValues: Key[]) => {
    // use row ID expands the specified table row
    if (!isTreeTable && !expandRowByClick) return;
    setExpandedRowKeys((pre) => [...pre, ...keyValues]);
  };

  function collapseRows(keyValues: Key[]) {
    // use row ID collapses the specified table row
    if (!isTreeTable && !expandRowByClick) return;
    setExpandedRowKeys((pre) => pre.filter((keyValue) => !keyValues.includes(keyValue)));
  }

  const getAllKeys = (data?: Recordable[]) => {
    const keyValues: Array<number | string> = [];
    (data || tableData).forEach((item) => {
      keyValues.push(parseRowKeyValue(rowKeyCreation, item));
      const children = item[childrenColumnName || 'children'];
      if (children?.length) {
        keyValues.push(...getAllKeys(children));
      }
    });
    return keyValues;
  };

  // 获取展开路径 keyValues
  const getKeyPaths = (
    records: Recordable[],
    childrenColumnName: string,
    keyValue: Key,
    paths: Array<Key>,
  ): boolean => {
    if (records.findIndex((record) => parseRowKeyValue(rowKeyCreation, record) === keyValue) > -1) {
      paths.push(keyValue);
      return true;
    } else {
      for (const record of records) {
        const children = record[childrenColumnName];
        if (Array.isArray(children) && getKeyPaths(children, childrenColumnName, keyValue, paths)) {
          paths.push(parseRowKeyValue(rowKeyCreation, record));
          return true;
        }
      }
    }
    return false;
  };

  // 手风琴展开
  const expandRowAccordion = (keyValue: Key) => {
    const paths: Array<Key> = [];
    getKeyPaths(tableData, childrenColumnName || 'children', keyValue, paths);
    setExpandedRowKeys(paths);
  };

  // 监听展开事件，用于支持手风琴展开效果
  const handleTableExpand = (expanded: boolean, record: Recordable) => {
    // 手风琴开关
    // isTreeTable 或 expandRowByClick 时支持
    // 展开操作
    if (accordion && (isTreeTable || expandRowByClick) && expanded) {
      nextTick(() => {
        expandRowAccordion(parseRowKeyValue(rowKeyCreation, record));
      });
    }
  };

  return {
    expandOption: expandOptionCreation,
    expandAll,
    collapseAll,
    expandRows,
    collapseRows,
    expandRowAccordion,
    handleTableExpand,
  };
};
