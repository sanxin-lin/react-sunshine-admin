import { Layout } from 'antd';
import classNames from 'classnames';

import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useLockPage } from '@/hooks/web/useLockPage';
import { useAppStore } from '@/stores/modules/app';

import { layoutInit } from '../init';

import LayoutContent from './content/Content';
import LayoutFeatures from './feature/Index';
import MultipleHeader from './header/MultipleHeader';
import LayoutSideBar from './sider/Index';

import './Index.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}

const Index: React.FC<IProps> = () => {
  // 初始化一些配置
  layoutInit();

  const { prefixCls } = useDesign('default-layout');
  const isMobile = useAppStore((state) => state.isMobile);
  const { showFullHeader } = useHeaderSetting();
  const { showSidebar, isMixSidebar, show: showMenu } = useMenuSetting();
  const { autoCollapse } = useMultipleTabSetting();
  // Create a lock screen monitor
  const lockEvents = useLockPage();

  const layoutClass = classNames(`ant-layout ${prefixCls}-out`, {
    'ant-layout-has-sider': isMixSidebar || showMenu,
    'ant-layout-auto-collapse-tabs': !showMenu && autoCollapse,
  });

  return (
    <Layout className={prefixCls} {...lockEvents}>
      {/* TODO LAYOUT */}
      <LayoutFeatures />
      {/* <LayoutHeader fixed v-if="getShowFullHeaderRef" /> */}
      <Layout className={layoutClass}>
        {(showSidebar || isMobile) && <LayoutSideBar />}
        <Layout className={`${prefixCls}-main`}>
          <MultipleHeader />
          <LayoutContent />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Index;
