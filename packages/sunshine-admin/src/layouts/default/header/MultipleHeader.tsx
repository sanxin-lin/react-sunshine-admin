import { CSSProperties } from 'react';
import { useCreation } from 'ahooks';
import classNames from 'classnames';

import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useFullContent } from '@/hooks/web/useFullContent';
import { useAppStore } from '@/stores/modules/app';

import { useLayoutHeight } from '../content/useContentViewHeight';
import MultipleTabs from '../tabs/Index';

import LayoutHeader from './Index';

import './MultipleHeader.less';

const HEADER_HEIGHT = 48;

const TABS_HEIGHT = 32;

const MultipleHeader = () => {
  // TODO useMultipleTabStore
  // const tabStore = useMultipleTabStore();
  const { setHeaderHeight } = useLayoutHeight();
  const { prefixCls } = useDesign('layout-multiple-header');
  const theme = useAppStore((state) => state.getThemeMode());

  const { fixed, showInsetHeader, showFullHeader, show: showHeader } = useHeaderSetting();

  const { calcContentWidth, split, show: showMenu } = useMenuSetting();

  const isMobile = useAppStore((state) => state.isMobile);

  const { fullContent } = useFullContent();

  const { show: showMultipleTabs, autoCollapse } = useMultipleTabSetting();

  const showTabs = showMultipleTabs || fullContent;

  const showPlaceholderDom = fixed || showFullHeader;

  const wrapperStyle = useCreation(() => {
    const style: CSSProperties = {};
    if (fixed) {
      style.width = isMobile ? '100%' : calcContentWidth;
    }
    if (showFullHeader) {
      style.top = `${HEADER_HEIGHT}px`;
    }
    return style;
  }, [fixed, calcContentWidth, showFullHeader, isMobile]);

  const isFixed = fixed || showFullHeader;

  const isUnFold = !showMenu && !showHeader;

  const placeholderDomStyle = useCreation((): CSSProperties => {
    let height = 0;
    if (!(autoCollapse && isUnFold)) {
      if ((showHeader || !split) && showHeader && !fullContent) {
        height += HEADER_HEIGHT;
      }
      if (showMultipleTabs && !fullContent) {
        height += TABS_HEIGHT;
      }
      setHeaderHeight(height);
    }
    return {
      height: `${height}px`,
    };
  }, [autoCollapse, isUnFold, showFullHeader, split, showHeader, fullContent, showMultipleTabs]);

  const wrapperClass = classNames(`${prefixCls} ${prefixCls}--${theme}}`, {
    [`${prefixCls}--fixed`]: isFixed,
  });

  return (
    <>
      {showPlaceholderDom && (
        <div className={`${prefixCls}__placeholder`} style={placeholderDomStyle}></div>
      )}
      <div style={wrapperStyle} className={wrapperClass}>
        {showInsetHeader && <LayoutHeader />}
        {showTabs && <MultipleTabs key="tabStore.getLastDragEndIndex" />}
      </div>
    </>
  );
};

export default MultipleHeader;
