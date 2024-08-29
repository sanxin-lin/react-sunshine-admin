import React, { useEffect, useRef } from 'react';
import { UIMatch } from 'react-router-dom';
import { useReactive } from 'ahooks';
import { isFunction } from 'lodash-es';

import { ThemeEnum } from '@/enums/appEnum';
import { useDesign } from '@/hooks/web/useDesign';
import { useRouterListener } from '@/hooks/web/useRouterListener';
import { useRouterMatched } from '@/hooks/web/useRouterMatched';
import { REDIRECT_ROUTE_ID } from '@/router/constants';
import { openWindow } from '@/utils';
import { isHttpUrl } from '@/utils/is';

import Menu from './components/Menu';
import SimpleSubMenu from './SimpleSubMenu';
import { MenuState } from './types';
import { useOpenKeys } from './useOpenKeys';

import './SimpleMenu.less';

import type { Menu as MenuType } from '#/router';

interface IProps {
  items?: MenuType[];
  collapse?: boolean;
  mixSider?: boolean;
  theme?: ThemeEnum;
  accordion?: boolean;
  collapsedShowTitle?: boolean;
  beforeClickFn?: (key: string) => Promise<boolean>;
  isSplitMenu?: boolean;
  onMenuClick?: (key: string) => void;
}

const SimpleMenu: React.FC<IProps> = (props) => {
  const {
    items = [] as MenuType[],
    collapse = false,
    mixSider = false,
    accordion = true,
    collapsedShowTitle,
    beforeClickFn,
    isSplitMenu,
    onMenuClick,
  } = props;

  // const [currentActiveMenu, setCurrentActiveMenu] = useState('');
  const isClickGo = useRef(false);

  const menuState = useReactive<MenuState>({
    activeName: '',
    openNames: [],
    activeSubMenuNames: [],
  });

  const { currentRoute } = useRouterMatched();

  const { prefixCls } = useDesign('simple-menu');

  const { setOpenKeys, openKeys } = useOpenKeys(menuState, items, accordion, mixSider, collapse);

  useEffect(() => {
    if (collapse) {
      menuState.openNames = [];
    } else {
      setOpenKeys(currentRoute.pathname);
    }
  }, [collapse]);
  useEffect(() => {
    if (!isSplitMenu) return;
    setOpenKeys(currentRoute.pathname);
  }, [items]);

  // TODO listenerRouteChange
  useRouterListener((matched) => {
    if (matched.currentRoute.id === REDIRECT_ROUTE_ID) return;

    // currentActiveMenu.value = route.meta?.currentActiveMenu as string;
    handleMenuChange(matched.currentRoute);

    // if (unref(currentActiveMenu)) {
    //   menuState.activeName = unref(currentActiveMenu);
    //   setOpenKeys(unref(currentActiveMenu));
    // }
  });

  const handleMenuChange = async (route?: UIMatch<unknown, unknown>) => {
    if (isClickGo.current) {
      isClickGo.current = false;
      return;
    }
    // TODO
    const path = (route || currentRoute).pathname;

    menuState.activeName = path;

    setOpenKeys(path);
  };

  const handleSelect = async (key: string) => {
    if (isHttpUrl(key)) {
      openWindow(key);
      return;
    }
    if (beforeClickFn && isFunction(beforeClickFn)) {
      const flag = await beforeClickFn(key);
      if (!flag) return;
    }

    onMenuClick?.(key);

    isClickGo.current = true;
    setOpenKeys(key);
    menuState.activeName = key;
  };
  return (
    <Menu
      {...props}
      activeName={menuState.activeName}
      openNames={openKeys}
      className={prefixCls}
      activeSubMenuNames={menuState.activeSubMenuNames}
      onSelect={handleSelect as any}
    >
      <>
        {items.map((item) => (
          <SimpleSubMenu
            item={item}
            key={item.path}
            parent={true}
            collapsedShowTitle={collapsedShowTitle}
            collapse={collapse}
          />
        ))}
      </>
    </Menu>
  );
};

export default SimpleMenu;
