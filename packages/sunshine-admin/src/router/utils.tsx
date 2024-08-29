import { RouteObject } from 'react-router-dom';
import { cloneDeep } from 'lodash-es';

import { isHttpUrl } from '@/utils/is';
import { findPath, treeMap } from '@/utils/tree';

import { ROOT_UNIQUE_ID } from './constants';

import { Recordable } from '#/global';
import { Menu } from '#/router';

// Determine whether the level exceeds 2 levels
// 判断级别是否超过2级
function isMultipleRoute(routeModule: RouteObject) {
  // Reflect.has 与 in 操作符 相同, 用于检查一个对象(包括它原型链上)是否拥有某个属性
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}

// 路径处理
function joinParentPath(menus: Menu[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    // https://next.router.vuejs.org/guide/essentials/nested-routes.html
    // Note that nested paths that start with / will be treated as a root path.
    // 请注意，以 / 开头的嵌套路径将被视为根路径。
    // This allows you to leverage the component nesting without having to use a nested URL.
    // 这允许你利用组件嵌套，而无需使用嵌套 URL。
    if (!(menu.path.startsWith('/') || isHttpUrl(menu.path))) {
      // path doesn't start with /, nor is it a url, join parent path
      // 路径不以 / 开头，也不是 url，加入父路径
      menu.path = `${parentPath}/${menu.path}`;
    }
    if (menu?.children?.length) {
      joinParentPath(menu.children, menu.handle?.hidePathForChildren ? parentPath : menu.path);
    }
  }
}

/**
 * Convert multi-level routing to level 2 routing
 * 将多级路由转换为 2 级路由
 */
export function flatMultiLevelRoutes(routeModules: RouteObject[]) {
  const modules: RouteObject[] = cloneDeep(routeModules);

  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    // 判断级别是否 多级 路由
    if (!isMultipleRoute(routeModule)) {
      // 声明终止当前循环， 即跳过此次循环，进行下一轮
      continue;
    }
    // 路由等级提升
    // promoteRouteLevel(routeModule);
  }
  return modules;
}

// 将路由转换成菜单
export function transformRouteToMenu(routeModList: RouteObject[], routerMapping = false) {
  // 借助 lodash 深拷贝
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList: RouteObject[] = [];

  // 对路由项进行修改
  cloneRouteModList.forEach((item) => {
    if (
      routerMapping &&
      item.handle.hideChildrenInMenu &&
      typeof item.handle.redirect === 'string'
    ) {
      item.path = item.handle.redirect;
    }

    if (item.handle?.single) {
      const realItem = item?.children?.[0];
      realItem && routeList.push(realItem);
    } else {
      routeList.push(item);
    }
  });
  // 提取树指定结构
  const list = treeMap(routeList, ROOT_UNIQUE_ID, {
    conversion: (node: RouteObject) => {
      const { handle: { hidden = false } = {}, id } = node;

      return {
        ...(node.handle || {}),
        handle: node.handle,
        name: id,
        id,
        hidden,
        path: node.path,
        // ...(redirect ? { redirect: redirect } : {}),
      } as Menu;
    },
  }) as Menu[];
  // 路径处理
  joinParentPath(list);
  return cloneDeep(list);
}

export function getAllParentPath<T = Recordable>(treeData: T[], path: string) {
  const menuList = findPath(treeData, (n) => n.path === path) as Menu[];
  return (menuList || []).map((item) => item.path);
}

// Parsing the menu module
export function transformMenuModule(menuModule: Menu): Menu {
  const menuList = [menuModule];

  joinParentPath(menuList);
  return menuList[0];
}
