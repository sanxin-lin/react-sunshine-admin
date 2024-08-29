import { uniq } from 'lodash-es';

import { MenuModeEnum } from '@/enums/menuEnum';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { getAllParentPath } from '@/router';

import { Key, MenuState } from './types';

import { Menu } from '#/router';

export const useOpenKeys = (
  menuState: MenuState,
  menus: Menu[],
  mode: MenuModeEnum,
  accordion: boolean,
) => {
  const { collapsed, isMixSidebar } = useMenuSetting();

  const setOpenKeys = (path: string) => {
    if (mode === MenuModeEnum.HORIZONTAL) {
      return;
    }
    const handle = () => {
      if (menus.length === 0) {
        menuState.openKeys = [];
        return;
      }
      if (!accordion) {
        menuState.openKeys = uniq([...menuState.openKeys, ...getAllParentPath(menus, path)]);
      } else {
        menuState.openKeys = getAllParentPath(menus, path);
      }
    };
    if (isMixSidebar) {
      handle();
    } else {
      setTimeout(handle, 16);
    }
  };

  const openKeys = (() => {
    const _collapsed = isMixSidebar ? false : collapsed;
    return _collapsed ? menuState.collapsedOpenKeys : menuState.openKeys;
  })();

  /**
   * @description:  重置值
   */
  const resetKeys = () => {
    menuState.selectedKeys = [];
    menuState.openKeys = [];
  };

  const handleOpenChange = (openKeys: Key[]) => {
    if (mode === MenuModeEnum.HORIZONTAL || !accordion || isMixSidebar) {
      menuState.openKeys = openKeys;
      return;
    }

    const rootSubMenuKeys: Key[] = [];
    for (const { children, path } of menus) {
      if (children && children.length > 0) {
        rootSubMenuKeys.push(path);
      }
    }

    if (collapsed) {
      const latestOpenKey = openKeys.find((key) => !menuState.openKeys.includes(key));
      if (rootSubMenuKeys.includes(latestOpenKey as string)) {
        menuState.openKeys = latestOpenKey ? [latestOpenKey] : [];
      } else {
        menuState.openKeys = openKeys;
      }
    } else {
      menuState.collapsedOpenKeys = openKeys;
    }
  };

  return { setOpenKeys, resetKeys, openKeys, handleOpenChange };
};
