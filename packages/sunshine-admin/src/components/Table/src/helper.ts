import { isFunction, isString } from 'lodash-es';
import { ROW_KEY } from './const';
import type { BasicTableProps } from './types/table';

export function parseRowKey<RecordType = any>(
  rowKey: BasicTableProps['rowKey'],
  record: RecordType,
  autoCreateKey?: boolean,
): number | string {
  if (autoCreateKey) {
    return ROW_KEY;
  } else {
    if (isString(rowKey)) {
      return rowKey;
    } else if (isFunction(rowKey)) {
      return rowKey(record) as any;
    } else {
      return ROW_KEY;
    }
  }
}

export function parseRowKeyValue<RecordType = any>(
  rowKey: BasicTableProps['rowKey'],
  record: RecordType,
  autoCreateKey?: boolean,
): number | string {
  return record[parseRowKey(rowKey, record, autoCreateKey)];
}
