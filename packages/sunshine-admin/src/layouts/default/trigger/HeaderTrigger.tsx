import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { ThemeEnum } from '@/enums/appEnum';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useDesign } from '@/hooks/web/useDesign';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {
  theme?: ThemeEnum;
}

const HeaderTrigger = (props: IProps) => {
  const { theme, className, ...wrapperProps } = props;
  const { collapsed, toggleCollapsed } = useMenuSetting();
  const { prefixCls } = useDesign('layout-header-trigger');

  return (
    <span
      {...wrapperProps}
      className={`${prefixCls} ${theme} ${className}`}
      onClick={toggleCollapsed}
    >
      {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </span>
  );
};

export default HeaderTrigger;
