import { useEffect, useRef, useState } from 'react';
import type { Definition } from '@logicflow/core';
import LogicFlow from '@logicflow/core';
import { BpmnElement, DndPanel, Menu, SelectionSelect, Snapshot } from '@logicflow/extension';
import { useCreation, useMount } from 'ahooks';

import { JsonPreview } from '@/components/CodeEditor';
import { BasicModal, useModal } from '@/components/Modal';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { useMessage } from '@/hooks/web/useMessage';
import { useAppStore } from '@/stores/modules/app';
import { copyText } from '@/utils/copyTextToClipboard';
import { nextTick } from '@/utils/dom';

import { toLogicFlowData } from './adpterForTurbo';
import { configDefaultDndPanel } from './config';
import FlowChartToolbar from './FlowChartToolbar';

import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';

interface IProps {
  flowOptions?: Definition;
  data?: any;
  toolbar?: boolean;
  patternItems?: any[];
}

const FlowChart = (props: IProps) => {
  const { flowOptions = {}, data = {}, toolbar = true, patternItems } = props;

  const lfContainerRef = useRef<HTMLDivElement | null>(null);
  const lfInstance = useRef<LogicFlow | null>(null);
  const [graphData, setGraphData] = useState<any>({});

  const { prefixCls } = useDesign('flow-chart');

  const themeMode = useAppStore((state) => state.getThemeMode());

  const [register, { openModal, closeModal }] = useModal();

  const { createMessage } = useMessage();

  const { t } = useLocale();

  const currentFlowOptions = useCreation(() => {
    const { flowOptions } = props;

    const defaultOptions: Partial<Definition> = {
      grid: true,
      background: {
        color: themeMode === 'light' ? '#f7f9ff' : '#151515',
      },
      keyboard: {
        enabled: true,
      },
      ...flowOptions,
    };
    return defaultOptions as Definition;
  }, [themeMode, flowOptions]);

  useEffect(() => {
    onRender();
  }, [data]);

  useEffect(() => {
    lfInstance.current?.updateEditConfig(currentFlowOptions);
  }, [currentFlowOptions]);

  const onRender = async () => {
    await nextTick();
    if (!lfInstance.current) {
      return;
    }
    const lFData = toLogicFlowData(data);
    lfInstance.current.render(lFData);
  };

  const onViewChange = () => {
    if (!lfInstance.current) {
      return;
    }
    setGraphData(lfInstance.current.getGraphData());
    openModal();
  };

  const init = async () => {
    await nextTick();
    const lfEl = lfContainerRef.current;
    if (!lfEl) {
      return;
    }
    LogicFlow.use(DndPanel);

    // Canvas configuration
    LogicFlow.use(Snapshot);
    // Use the bpmn plug-in to introduce bpmn elements, which can be used after conversion in turbo
    LogicFlow.use(BpmnElement);
    // Start the right-click menu
    LogicFlow.use(Menu);
    LogicFlow.use(SelectionSelect);
    const instance = new LogicFlow({
      ...currentFlowOptions,
      container: lfEl,
    });
    lfInstance.current = instance;
    instance?.setDefaultEdgeType('line');
    onRender();
    instance?.setPatternItems(patternItems || configDefaultDndPanel(instance));
  };

  useMount(() => {
    init();
  });

  const copy = () => {
    copyText(JSON.stringify(graphData, null, 2), null).then(() => {
      createMessage.success('复制成功');
    });
  };

  return (
    <div className={`${prefixCls} h-full`}>
      {toolbar && <FlowChartToolbar onViewChange={onViewChange} logicInstance={lfInstance} />}
      <div ref={lfContainerRef} className="h-full"></div>
      <BasicModal
        register={register}
        title="流程数据"
        width="50%"
        onCancel={closeModal}
        okText={t('layout.setting.copyBtn')}
        onOk={copy}
      >
        <JsonPreview data={graphData} />
      </BasicModal>
    </div>
  );
};

export default FlowChart;
