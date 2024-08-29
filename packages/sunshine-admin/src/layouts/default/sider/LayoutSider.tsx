import { CSSProperties, useRef } from 'react';
import { useCreation } from 'ahooks';
import { Layout } from 'antd';
import classNames from 'classnames';

import { MenuModeEnum, MenuSplitTyeEnum, TriggerEnum } from '@/enums/menuEnum';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useDisplay } from '@/hooks/utils/useDisplay';
import { useDesign } from '@/hooks/web/useDesign';
import { useAppStore } from '@/stores/modules/app';

import LayoutMenu from '../menu/Index';

import DragBar from './DragBar';
import { DragBarType } from './types';
import { useDragLine, useSiderEvent, useTrigger } from './useLayoutSider';

import './LayoutSider.less';

import { Nullable } from '#/global';

// import { BaseProps } from '#/compoments';

// interface IProps extends BaseProps {}

const LayoutSider = () => {
  const dragBarRef = useRef<Nullable<DragBarType>>(null);
  const sideRef = useRef(null);
  const theme = useAppStore((state) => state.getMenuThemeMode());
  const { collapsed, menuWidth, split, realWidth, hidden, fixed, isMixMode, trigger } =
    useMenuSetting();
  const { prefixCls } = useDesign('layout-sideBar');

  const isMobile = useAppStore((state) => state.isMobile);

  const { triggerAttr } = useTrigger(isMobile);

  useDragLine(sideRef, dragBarRef);

  const { collapsedWidth, onBreakpointChange } = useSiderEvent();

  const mode = split ? MenuModeEnum.INLINE : null;

  const splitType = split ? MenuSplitTyeEnum.LEFT : MenuSplitTyeEnum.NONE;

  const showSider = split ? !hidden : true;

  const siderClass = classNames(`${prefixCls}`, {
    [`${prefixCls}--fixed`]: fixed,
    [`${prefixCls}--mix`]: isMixMode && !isMobile,
  });

  const hiddenDomStyle = useCreation<CSSProperties>(() => {
    const width = `${realWidth}px`;
    return {
      width,
      overflow: 'hidden',
      flex: `0 0 ${width}`,
      maxWidth: width,
      minWidth: width,
      transition: 'all 0.2s',
    };
  }, [realWidth]);

  const showStyle = useDisplay(showSider);

  return (
    <>
      {fixed && !isMobile && <div style={{ ...hiddenDomStyle, ...showStyle }}></div>}
      {/*     
    针对场景：菜单折叠按钮为“底部”时：
    关于 breakpoint，
    组件定义的是 lg: '992px'，
    而 rben 定义的是 lg: '960px'，
    现把组件的 breakpoint 设为 md，
    则组件的 md: '768px' < rben的 lg: '960px'，
    防止 collapsedWidth 在 960px ~ 992px 之间错误设置为 0，
    从而防止出现浮动的 trigger（且breakpoint事件失效） */}
      <Layout.Sider
        style={showStyle}
        ref={sideRef}
        breakpoint={trigger === TriggerEnum.FOOTER ? 'md' : 'lg'}
        collapsible
        className={siderClass}
        width={menuWidth}
        collapsed={collapsed}
        collapsedWidth={collapsedWidth}
        theme={theme}
        {...triggerAttr}
        onBreakpoint={onBreakpointChange}
      >
        <>
          <LayoutMenu theme={theme} menuMode={mode} splitType={splitType} />
          <DragBar ref={dragBarRef} />
        </>
      </Layout.Sider>
    </>
  );
};

export default LayoutSider;
