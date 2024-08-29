import { RefObject, useState } from 'react';
import LogicFlow from '@logicflow/core';
import { useMount, useUnmount } from 'ahooks';
import { Divider, Tooltip } from 'antd';

import { Icon } from '@/components/Icon';
import { useDesign } from '@/hooks/web/useDesign';
import { nextTick } from '@/utils/dom';

import { ToolbarTypeEnum } from './enum';
import type { ToolbarConfig } from './types';

import './FlowChartToolbar.less';

interface IProps {
  logicInstance: RefObject<LogicFlow | null>;

  onViewChange?: () => void;
}

const FlowChartToolbar = (props: IProps) => {
  const { logicInstance, onViewChange } = props;

  const { prefixCls } = useDesign('flow-chart');

  const [toolbarItemList, setToolbarItemList] = useState<ToolbarConfig[]>([
    {
      type: ToolbarTypeEnum.ZOOM_IN,
      icon: 'codicon:zoom-out',
      tooltip: '缩小',
    },
    {
      type: ToolbarTypeEnum.ZOOM_OUT,
      icon: 'codicon:zoom-in',
      tooltip: '放大',
    },
    {
      type: ToolbarTypeEnum.RESET_ZOOM,
      icon: 'codicon:screen-normal',
      tooltip: '重置比例',
    },
    { separate: true },
    {
      type: ToolbarTypeEnum.UNDO,
      icon: 'ion:arrow-undo-outline',
      tooltip: '后退',
      disabled: true,
    },
    {
      type: ToolbarTypeEnum.REDO,
      icon: 'ion:arrow-redo-outline',
      tooltip: '前进',
      disabled: true,
    },
    { separate: true },
    {
      type: ToolbarTypeEnum.SNAPSHOT,
      icon: 'ion:download-outline',
      tooltip: '下载',
    },
    {
      type: ToolbarTypeEnum.VIEW_DATA,
      icon: 'carbon:document-view',
      tooltip: '查看数据',
    },
  ]);

  const onHistoryChange = ({ data: { undoAble, redoAble } }) => {
    const itemsList = [...toolbarItemList];
    const undoIndex = itemsList.findIndex((item) => item.type === ToolbarTypeEnum.UNDO);
    const redoIndex = itemsList.findIndex((item) => item.type === ToolbarTypeEnum.REDO);
    if (undoIndex !== -1) {
      itemsList[undoIndex].disabled = !undoAble;
    }
    if (redoIndex !== -1) {
      itemsList[redoIndex].disabled = !redoAble;
    }
    setToolbarItemList(itemsList);
  };

  const onControl = (item) => {
    const instance = logicInstance.current;
    if (!instance) {
      return;
    }
    switch (item.type) {
      case ToolbarTypeEnum.ZOOM_IN:
        instance.zoom();
        break;
      case ToolbarTypeEnum.ZOOM_OUT:
        instance.zoom(true);
        break;
      case ToolbarTypeEnum.RESET_ZOOM:
        instance.resetZoom();
        break;
      case ToolbarTypeEnum.UNDO:
        instance.undo();
        break;
      case ToolbarTypeEnum.REDO:
        instance.redo();
        break;
      case ToolbarTypeEnum.SNAPSHOT:
        instance.getSnapshot();
        break;
      case ToolbarTypeEnum.VIEW_DATA:
        onViewChange?.();
        break;
    }
  };

  useMount(() => {
    const instance = logicInstance.current;
    if (instance) {
      nextTick(() => {
        instance.on('history:change', onHistoryChange);
      });
    }
  });

  useUnmount(() => {
    const instance = logicInstance.current;
    if (instance) {
      nextTick(() => {
        instance.off('history:change', onHistoryChange);
      });
    }
  });

  return (
    <div className={`${prefixCls}-toolbar flex items-center px-2 py-1`}>
      {toolbarItemList.map((item) => (
        <div key={item.icon}>
          <Tooltip
            placement="bottom"
            {...(item.disabled ? { open: false } : {})}
            title={item.tooltip}
          >
            {item.icon && (
              <span className={`${prefixCls}-toolbar__icon`} onClick={() => onControl(item)}>
                <Icon
                  icon={item.icon}
                  className={item.disabled ? 'cursor-not-allowed disabled' : 'cursor-pointer'}
                />
              </span>
            )}
          </Tooltip>
          {item.separate && <Divider type="vertical" />}
        </div>
      ))}
    </div>
  );
};

export default FlowChartToolbar;
