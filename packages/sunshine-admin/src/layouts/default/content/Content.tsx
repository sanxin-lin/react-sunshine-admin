import { useRef } from 'react';
import { FloatButton, Spin } from 'antd';

import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useMultipleTabStore } from '@/stores/modules/multipleTab';

import PageLayout from '../page/Page';

import { ContentContext, createContentProviderValue } from './context';
import { useContentViewHeight } from './useContentViewHeight';

import './Content.less';

const Content = () => {
  const { prefixCls } = useDesign('layout-content');
  // TODO useTransitionSetting
  // const { getOpenPageLoading } = useTransitionSetting();
  const { layoutContentMode, pageLoading, useOpenBackTop } = useRootSetting();

  const { contentHeight, setPageHeight, pageHeight } = useContentViewHeight();

  const refreshKey = useMultipleTabStore((state) => state.refreshKey);

  const providerValue = createContentProviderValue({
    contentHeight,
    setPageHeight,
    pageHeight,
  });

  // TODO useTransitionSetting
  //   const spinning = openPageLoading && pageLoading
  const spinning = pageLoading;

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <ContentContext.Provider value={providerValue}>
      <div ref={contentRef} className={`${prefixCls} ${layoutContentMode}`}>
        <Spin spinning={spinning}>
          <PageLayout key={refreshKey} />
          {useOpenBackTop && (
            <FloatButton.BackTop target={() => contentRef.current!} visibilityHeight={100} />
          )}
        </Spin>
      </div>
    </ContentContext.Provider>
  );
};

export default Content;
