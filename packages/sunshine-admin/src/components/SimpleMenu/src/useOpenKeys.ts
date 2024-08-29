import { debounce, uniq } from 'lodash-es';

import { getAllParentPath } from '@/router';

import type { MenuState } from './types';

import { Menu } from '#/router';

export function useOpenKeys(
  menuState: MenuState,
  menus: Menu[],
  accordion: boolean,
  mixSider: boolean,
  collapse: boolean,
) {
  const debounceSetOpenKeys = debounce(setOpenKeys, 50);
  async function setOpenKeys(path: string) {
    const native = !mixSider;
    const menuList = [...menus];

    const handle = () => {
      if (menuList?.length === 0) {
        menuState.activeSubMenuNames = [];
        menuState.openNames = [];
        return;
      }
      const keys = getAllParentPath(menuList, path);

      if (!accordion) {
        menuState.openNames = uniq([...menuState.openNames, ...keys]);
      } else {
        menuState.openNames = keys;
      }
      menuState.activeSubMenuNames = [...menuState.openNames];
    };
    if (native) {
      handle();
    } else {
      setTimeout(handle, 30);
    }
  }

  const openKeys = collapse ? [] : menuState.openNames;

  return { setOpenKeys: debounceSetOpenKeys, openKeys };
}
