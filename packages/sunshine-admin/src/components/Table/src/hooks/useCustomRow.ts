import { Key } from 'antd/es/table/interface';
import { BasicTableProps } from '../types/table';
import { Recordable } from '#/global';
import { parseRowKeyValue } from '../helper';

interface Options {
  setSelectedRowKeys: (keyValues: Key[]) => void;
  getSelectRowKeys: () => Key[];
  clearSelectedRowKeys: () => void;
  autoCreateKey: boolean | undefined;
  // onRowClick: BasicTableProps['onRowClick'];
  // onRowDbClick: BasicTableProps['onRowDbClick'];
  // onRowContextMenu: BasicTableProps['onRowContextMenu'];
  // onRowMouseEnter: BasicTableProps['onRowMouseEnter'];
  // onRowMouseLeave: BasicTableProps['onRowMouseLeave'];
}

export const useCustomRow = (props: BasicTableProps, options: Options) => {
  const {
    rowSelection,
    rowKey,
    clickToRowSelect,
    onRowClick,
    onRowContextMenu,
    onRowDbClick,
    onRowMouseEnter,
    onRowMouseLeave,
  } = props;
  const { setSelectedRowKeys, getSelectRowKeys, autoCreateKey, clearSelectedRowKeys } = options;

  const customRow = (record: Recordable<any>, index: number) => {
    return {
      onClick: (e: Event) => {
        e.stopPropagation();
        const click = () => {
          if (!rowSelection || !clickToRowSelect) return;
          const keyValues = getSelectRowKeys() || [];
          const keyValue = parseRowKeyValue(rowKey, record, autoCreateKey);
          if (!keyValue) return;

          const isCheckbox = rowSelection.type === 'checkbox';
          if (isCheckbox) {
            // 找到tr
            const tr = (e as MouseEvent)
              .composedPath?.()
              .find((dom) => (dom as HTMLElement).tagName === 'TR') as HTMLElement;
            if (!tr) return;
            // 找到Checkbox，检查是否为disabled
            const checkBox = tr.querySelector('input[type=checkbox]');
            if (!checkBox || checkBox.hasAttribute('disabled')) return;
            if (!keyValues.includes(keyValue)) {
              keyValues.push(keyValue);
              setSelectedRowKeys(keyValues);
              return;
            }
            const keyIndex = keyValues.findIndex((item) => item === keyValue);
            keyValues.splice(keyIndex, 1);
            setSelectedRowKeys(keyValues);
            return;
          }

          const isRadio = rowSelection.type === 'radio';
          if (isRadio) {
            if (!keyValues.includes(keyValue)) {
              if (keyValues.length) {
                clearSelectedRowKeys();
              }
              setSelectedRowKeys([keyValue]);
              return;
            }
            clearSelectedRowKeys();
          }
        };
        click();
        onRowClick?.(record, index, e);
      },
      onDoubleClick: (e: Event) => {
        onRowDbClick?.(record, index, e);
      },
      onContextMenu: (e: Event) => {
        onRowContextMenu?.(record, index, e);
      },
      onMouseEnter: (e: Event) => {
        onRowMouseEnter?.(record, index, e);
      },
      onMouseLeave: (e: Event) => {
        onRowMouseLeave?.(record, index, e);
      },
    };
  };

  return {
    customRow,
  };
};
