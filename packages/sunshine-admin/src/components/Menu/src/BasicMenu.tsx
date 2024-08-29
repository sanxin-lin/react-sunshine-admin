import { useEffect, useState } from 'react';
import { UIMatch } from 'react-router-dom';
import { useReactive } from 'ahooks';
import { Menu, MenuProps } from 'antd';
import classNames from 'classnames';
import { isFunction } from 'lodash-es';

import { ThemeEnum } from '@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useRouterListener } from '@/hooks/web/useRouterListener';
import { useRouterMatched } from '@/hooks/web/useRouterMatched';
import { getAllParentPath } from '@/router';
import { REDIRECT_ROUTE_ID } from '@/router/constants';

import BasicSubMenuItem from './components/BasicSubMenuItem';
import { Key, MenuState } from './types';
import { useOpenKeys } from './useOpenKeys';

import './BasicMenu.less';

import { BaseProps } from '#/compoments';
import { Menu as MenuType } from '#/router';

interface IProps extends BaseProps {
  items?: MenuType[];
  // collapsedShowTitle?: boolean;
  // 最好是4 倍数
  inlineIndent?: number;
  // 菜单组件的mode属性
  mode?: MenuProps['mode'];
  type?: MenuTypeEnum;
  theme?: ThemeEnum;
  inlineCollapsed?: boolean;
  mixSider?: boolean;
  isHorizontal?: boolean;
  accordion?: boolean;
  beforeClickFn?: (key: Key) => Promise<boolean>;
  menuClick?: (key: Key) => void;
}

const BasicMenu: React.FC<IProps> = (props) => {
  const {
    items = [],
    // collapsedShowTitle,
    inlineIndent = 20,
    mode = MenuModeEnum.INLINE,
    type = MenuTypeEnum.MIX,
    theme = ThemeEnum.DARK,
    inlineCollapsed,
    mixSider,
    isHorizontal,
    accordion = true,
    className,
    beforeClickFn,
    menuClick,
  } = props;
  const [isClickGo, setIsClickGo] = useState(false);
  // const [currentActiveMenu, setCurrentActiveMenu] = useState('');

  const menuState = useReactive<MenuState>({
    defaultSelectedKeys: [],
    openKeys: [],
    selectedKeys: [],
    collapsedOpenKeys: [],
  });
  const { prefixCls } = useDesign('basic-menu');

  const { collapsed, topMenuAlign, split } = useMenuSetting();

  const { currentRoute } = useRouterMatched();

  const { handleOpenChange, setOpenKeys, openKeys } = useOpenKeys(
    menuState,
    items,
    mode as any,
    accordion,
  );

  const isTopMenu =
    (type === MenuTypeEnum.TOP_MENU && mode === MenuModeEnum.HORIZONTAL) || (isHorizontal && split);

  const align = isHorizontal && split ? 'start' : topMenuAlign;
  const wrapperClassName = classNames(`${className} ${prefixCls} justify-${align}`, {
    [`${prefixCls}__second`]: !isHorizontal && split,
    [`${prefixCls}__sidebar-hor`]: isTopMenu,
  });

  const inlineCollapseOptions = (() => {
    const isInline = mode === MenuModeEnum.INLINE;

    const inlineCollapseOptions: { inlineCollapsed?: boolean } = {};
    if (isInline) {
      inlineCollapseOptions.inlineCollapsed = mixSider ? false : collapsed;
    }
    return inlineCollapseOptions;
  })();

  useRouterListener((matched) => {
    if (matched.currentRoute.id === REDIRECT_ROUTE_ID) return;
    handleMenuChange(matched.currentRoute);
    // currentActiveMenu.value = route.meta?.currentActiveMenu as string;

    // if (unref(currentActiveMenu)) {
    //   menuState.selectedKeys = [unref(currentActiveMenu)];
    //   setOpenKeys(unref(currentActiveMenu));
    // }
  });

  // TODO route
  const handleMenuChange = async (route?: UIMatch<unknown, unknown>) => {
    if (isClickGo) {
      setIsClickGo(false);
      return;
    }
    const path = (route ?? currentRoute).pathname;
    setOpenKeys(path);
    // if (currentActiveMenu) return;

    if (isHorizontal && split) {
      //   const parentPath = await getCurrentParentPath(path);
      // TODO route
      const parentPath = '';
      menuState.selectedKeys = [parentPath];
    } else {
      const parentPaths = await getAllParentPath(items, path);
      menuState.selectedKeys = parentPaths;
    }
  };

  const handleMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (beforeClickFn && isFunction(beforeClickFn)) {
      const flag = await beforeClickFn(key);
      if (!flag) return;
    }
    menuClick?.(key);

    setIsClickGo(true);
    menuState.selectedKeys = [key];
  };

  useEffect(() => {
    if (!mixSider) {
      handleMenuChange();
    }
  }, [items]);

  return (
    <Menu
      selectedKeys={menuState.selectedKeys as string[]}
      defaultSelectedKeys={menuState.defaultSelectedKeys as string[]}
      mode={mode}
      openKeys={openKeys as string[]}
      inlineIndent={inlineIndent}
      theme={theme}
      onOpenChange={handleOpenChange}
      className={wrapperClassName}
      onClick={handleMenuClick}
      subMenuOpenDelay={0.2}
      inlineCollapsed={inlineCollapsed}
      {...inlineCollapseOptions}
    >
      {items.map((item) => (
        <BasicSubMenuItem item={item} theme={theme} isHorizontal={isHorizontal} />
      ))}
    </Menu>
  );
};

export default BasicMenu;
