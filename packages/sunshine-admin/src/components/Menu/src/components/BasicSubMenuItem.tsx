import { Menu } from 'antd';

import { ThemeEnum } from '@/enums/appEnum';

import BasicMenuItem from './BasicMenuItem';
import MenuItemContent from './MenuItemContent';

import { BaseProps } from '#/compoments';
import { Menu as MenuType } from '#/router';

interface IProps extends BaseProps {
  item: MenuType;

  //   level?: number;
  theme?: ThemeEnum;
  //   showTitle?: boolean;
  isHorizontal?: boolean;
}

const BasicSubMenuItem: React.FC<IProps> = (props) => {
  const { item, theme, className, isHorizontal } = props;

  const showMenu = item?.handle?.hideMenu;
  const menuHasChildren = (menuItem: MenuType) => {
    return (
      !menuItem.handle?.hideChildrenInMenu &&
      Reflect.has(menuItem, 'children') &&
      !!menuItem.children &&
      menuItem.children.length > 0
    );
  };

  if (!showMenu) return null;

  if (menuHasChildren(item)) {
    return (
      <Menu.SubMenu
        className={`${theme} ${className}`}
        key={`submenu-${item.path}`}
        popupClassName="app-top-menu-popup"
        title={<MenuItemContent item={item} />}
      >
        <>
          {(item.children ?? []).map((c) => (
            <BasicSubMenuItem item={c} theme={theme} isHorizontal={isHorizontal} key={c.path} />
          ))}
        </>
      </Menu.SubMenu>
    );
  }

  return <BasicMenuItem item={item} />;
};

export default BasicSubMenuItem;
