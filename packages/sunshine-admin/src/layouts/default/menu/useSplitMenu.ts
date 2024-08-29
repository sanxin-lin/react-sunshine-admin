import { useEffect, useState } from 'react';
import { useMount } from 'ahooks';

import { MenuSplitTyeEnum } from '@/enums/menuEnum';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { getMenus, getShallowMenus } from '@/router/menu';
import { useAppStore } from '@/stores/modules/app';
import { usePermissionStore } from '@/stores/modules/permission';

import { Menu } from '#/router';

// TODO useLayoutMenu
export const useSplitMenu = (splitType: MenuSplitTyeEnum) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const { setMenuSetting, isHorizontal, split } = useMenuSetting();
  const { lastBuildMenuTime, backMenuList, buildRoutes } = usePermissionStore((state) => ({
    lastBuildMenuTime: state.lastBuildMenuTime,
    backMenuList: state.backMenuList,
    buildRoutes: state.buildRoutes,
  }));

  useMount(() => {
    buildRoutes();
  });

  const isMobile = useAppStore((state) => state.isMobile);

  const splitNotLeft = splitType !== MenuSplitTyeEnum.LEFT && !isHorizontal;

  const splitLeft = !split || splitType !== MenuSplitTyeEnum.LEFT;

  const normalType = splitType === MenuSplitTyeEnum.NONE || !split;

  const spiltTop = splitType === MenuSplitTyeEnum.TOP;

  // get menus
  const genMenus = async () => {
    // normal mode
    if (normalType || isMobile) {
      const result = await getMenus();
      setMenus(result);
      return;
    }

    // split-top
    if (spiltTop) {
      const result = await getShallowMenus();
      setMenus(result);
      return;
    }
  };

  useEffect(() => {
    genMenus();
  }, [lastBuildMenuTime, backMenuList]);

  useEffect(() => {
    if (splitNotLeft) return;
    genMenus();
  }, [split, splitNotLeft]);

  return {
    menus,
    setMenus,
  };
};
