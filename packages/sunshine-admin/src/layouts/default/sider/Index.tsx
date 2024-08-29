import { Drawer } from 'antd';

import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useAppStore } from '@/stores/modules/app';

import LayoutSider from './LayoutSider';
import MixSider from './MixSider';

import './Index.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}

const Index: React.FC<IProps> = (props) => {
  const { className, ...wrapperProps } = props;
  const { prefixCls } = useDesign('layout-sider-wrapper');
  const isMobile = useAppStore((state) => state.isMobile);
  const { setMenuSetting, collapsed, menuWidth, isMixSidebar } = useMenuSetting();

  const onClose = () => {
    setMenuSetting({
      collapsed: true,
    });
  };

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        className={`${prefixCls} ${className}`}
        width={menuWidth}
        getContainer={false}
        open={collapsed}
        onClose={onClose}
        {...wrapperProps}
      >
        <LayoutSider />
      </Drawer>
    );
  }
  if (isMixSidebar) {
    return <MixSider />;
  }

  return <LayoutSider />;
};

export default Index;
