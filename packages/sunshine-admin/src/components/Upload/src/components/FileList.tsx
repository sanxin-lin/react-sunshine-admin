import { useModalContextSelctor } from '@/components/Modal';
import { FileListProps } from '../types/props';
import { CSSProperties, useEffect, useRef } from 'react';
import { nextTick } from '@/utils/dom';
import { useCreation, useMount } from 'ahooks';
import { useSortable } from '@/hooks/web/useSortable';
import { isArray, isFunction, isNil } from 'lodash-es';
import { FileBasicColumn } from '../types';

import './FileList.less';
import classNames from 'classnames';

const FileList = (props: FileListProps) => {
  const {
    columns = null,
    actionColumn = null,
    dataSource = null,
    openDrag = false,
    dragOptions = {} as FileListProps['dragOptions'],
    onDataSourceChange,
  } = props;

  const redoModalHeight = useModalContextSelctor((state) => state.redoModalHeight);
  const sortableContainer = useRef<HTMLTableSectionElement>(null);
  useEffect(() => {
    nextTick(() => {
      redoModalHeight?.();
    });
  }, [dataSource]);

  useMount(() => {
    if (openDrag) {
      useSortable(sortableContainer, {
        ...props.dragOptions,
        onEnd: ({ oldIndex, newIndex }) => {
          // position unchanged
          if (oldIndex === newIndex) {
            return;
          }
          const { onAfterEnd } = dragOptions!;

          if (!isNil(oldIndex) && !isNil(newIndex) && isArray(dataSource)) {
            const data = [...dataSource];

            const [oldItem] = data.splice(oldIndex, 1);
            data.splice(newIndex, 0, oldItem);

            nextTick(() => {
              onDataSourceChange?.(data);

              isFunction(onAfterEnd) && onAfterEnd(data);
            });
          }
        },
      }).initSortable();
    }
  });

  const columnList = useCreation<FileBasicColumn[]>(() => {
    const _columnList: any[] = [];
    if (columns) {
      _columnList.push(...columns);
    }
    if (actionColumn) {
      _columnList.push(actionColumn);
    }
    return _columnList;
  }, [actionColumn, columns]);

  return (
    <div className="overflow-x-auto">
      <table className="file-table">
        <colgroup>
          {columnList.map((item) => {
            const { width = 0, dataIndex } = item;
            const style: CSSProperties = {
              width: `${width}px`,
              minWidth: `${width}px`,
            };
            return <col style={width ? style : {}} key={dataIndex} />;
          })}
        </colgroup>
        <thead>
          <tr className="file-table-tr">
            {columnList.map((item) => {
              const { title = '', align = 'center', dataIndex } = item;
              return (
                <th className={classNames('file-table-th', align)} key={dataIndex}>
                  {title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody ref={sortableContainer}>
          {dataSource?.map((record = {}, index) => {
            return (
              <tr className="file-table-tr" key={`${index + record.name || ''}`}>
                {columnList.map((item) => {
                  const { dataIndex = '', customRender, align = 'center' } = item;
                  const render = customRender && isFunction(customRender);
                  return (
                    <td className={classNames('file-table-td break-all', align)} key={dataIndex}>
                      {render
                        ? customRender?.({ text: record[dataIndex], record })
                        : record[dataIndex]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
