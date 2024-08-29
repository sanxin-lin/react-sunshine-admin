import { RouteObject } from 'react-router-dom';
import { pathToRegexp } from 'path-to-regexp';

import { PermissionModeEnum } from '@/enums/appEnum';
import { useAppStore } from '@/stores/modules/app';
import { usePermissionStore } from '@/stores/modules/permission';
import { isHttpUrl } from '@/utils/is';

import { getAllParentPath, transformMenuModule } from './utils';
import { filter } from '@/utils/tree';

import { Recordable } from '#/global';
import type { Menu } from '#/router';

const modules = import.meta.glob('../routes/modules/**/*.ts', { eager: true });

const menuModules: Menu[] = [];

Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  menuModules.push(...modList);
});

// ===========================
// ==========Helper===========
// ===========================

const getPermissionMode = () => {
  return useAppStore.getState().getProjectConfig().permissionMode;
};
const getRouteList = () => {
  return usePermissionStore.getState().routerList;
};
const isBackMode = () => {
  return getPermissionMode() === PermissionModeEnum.BACK;
};

const isRouteMappingMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROUTE_MAPPING;
};

const isRoleMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROLE;
};

const staticMenus: Menu[] = [];
(() => {
  menuModules.sort((a, b) => {
    return (a.orderNo || 0) - (b.orderNo || 0);
  });

  for (const menu of menuModules) {
    staticMenus.push(transformMenuModule(menu));
  }
})();

async function getAsyncMenus() {
  const permissionStore = usePermissionStore.getState();
  //递归过滤所有隐藏的菜单
  const menuFilter = (items) => {
    return items.filter((item) => {
      const show = !item.meta?.hideMenu && !item.hideMenu;
      if (show && item.children) {
        item.children = menuFilter(item.children);
      }
      return show;
    });
  };
  if (isBackMode()) {
    return menuFilter(permissionStore.backMenuList);
  }
  if (isRouteMappingMode()) {
    return menuFilter(permissionStore.frontMenuList);
  }
  return staticMenus;
}

export const getMenus = async (): Promise<Menu[]> => {
  const menus = await getAsyncMenus();
  if (isRoleMode()) {
    const routes = getRouteList();
    return filter(menus, basicFilter(routes));
  }
  return menus;
};

export async function getCurrentParentPath(currentPath: string) {
  const menus = await getAsyncMenus();
  const allParentPath = await getAllParentPath(menus, currentPath);
  return allParentPath?.[0];
}

// Get the level 1 menu, delete children
export async function getShallowMenus(): Promise<Menu[]> {
  const menus = await getAsyncMenus();
  const shallowMenuList = menus.map((item) => ({ ...item, children: undefined }));
  if (isRoleMode()) {
    const routes = getRouteList();
    return shallowMenuList.filter(basicFilter(routes));
  }
  return shallowMenuList;
}

// Get the children of the menu
export async function getChildrenMenus(parentPath: string) {
  const menus = await getMenus();
  const parent = menus.find((item) => item.path === parentPath);
  if (!parent || !parent.children || !!parent?.handle?.hideChildrenInMenu) {
    return [] as Menu[];
  }
  if (isRoleMode()) {
    const routes = getRouteList();
    return filter(parent.children, basicFilter(routes));
  }
  return parent.children;
}

function basicFilter(routes: RouteObject[]) {
  return (menu: Menu) => {
    const matchRoute = routes.find((route) => {
      if (isHttpUrl(menu.path)) return true;

      if (route.handle?.carryParam) {
        return pathToRegexp(route.handle).test(menu.path);
      }
      const isSame = route.path === menu.path;
      if (!isSame) return false;

      if (route.handle?.ignoreAuth) return true;

      return isSame || pathToRegexp(route.path!).test(menu.path);
    });

    if (!matchRoute) return false;
    menu.icon = (menu.icon || matchRoute.handle.icon) as string;
    menu.handle = matchRoute.handle;
    return true;
  };
}
