import { RouteObject } from 'react-router-dom';
import { filter } from 'lodash-es';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { getPermCode } from '@/api/sys/user';
import { PermissionModeEnum } from '@/enums/appEnum';
import { PageEnum } from '@/enums/pageEnum';
import { asyncRoutes } from '@/router/routes';
import { ERROR_LOG_ROUTE } from '@/router/routes/basic';
import { flatMultiLevelRoutes, transformRouteToMenu } from '@/router/utils';
import projectSetting from '@/settings/projectSetting';

import { useAppStore } from './app';
import { useUserStore } from './user';

import { Menu } from '#/router';

interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList: string[] | number[];
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: number;
  // Backstage menu list
  // 后台菜单列表
  backMenuList: Menu[];
  // 菜单列表
  frontMenuList: Menu[];
  // 路由列表
  routerList: RouteObject[];

  setPermCodeList(codeList: string[]): void;

  setBackMenuList(list: Menu[]): void;

  setFrontMenuList(list: Menu[]): void;

  setRouterList(list: RouteObject[]): void;

  setLastBuildMenuTime(): void;

  setDynamicAddedRoute(added: boolean): void;

  resetState(): void;

  changePermissionCode(): Promise<void>;

  buildRoutes(): Promise<any[]>;
}
export const usePermissionStore = create<PermissionState>((set, get) => ({
  // 权限代码列表
  permCodeList: [],
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute: false,
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: 0,
  // Backstage menu list
  // 后台菜单列表
  backMenuList: [],
  // menu List
  // 菜单列表
  frontMenuList: [],
  // 路由列表
  routerList: [],

  setPermCodeList(codeList: string[]) {
    set({ permCodeList: codeList });
  },

  setBackMenuList(list: Menu[]) {
    set({ backMenuList: list });
    list?.length > 0 && get().setLastBuildMenuTime();
  },

  setFrontMenuList(list: Menu[]) {
    set({ frontMenuList: list });
  },

  setRouterList(list) {
    set({ routerList: list });
  },

  setLastBuildMenuTime() {
    set({ lastBuildMenuTime: new Date().getTime() });
  },

  setDynamicAddedRoute(added: boolean) {
    set({ isDynamicAddedRoute: added });
  },

  resetState(): void {
    set({
      isDynamicAddedRoute: false,
      permCodeList: [],
      backMenuList: [],
      lastBuildMenuTime: 0,
    });
  },

  async changePermissionCode() {
    const codeList = await getPermCode();
    get().setPermCodeList(codeList);
  },

  // 构建路由
  async buildRoutes(): Promise<any[]> {
    const { setFrontMenuList, setRouterList } = get();
    const { getRoleList, getUserInfo } = useUserStore.getState();
    const { getProjectConfig } = useAppStore.getState();
    const userInfo = getUserInfo();
    const { permissionMode = projectSetting.permissionMode } = getProjectConfig();
    const roleList = getRoleList() || [];
    let routes: RouteObject[] = [];

    // 路由过滤器 在 函数filter 作为回调传入遍历使用
    const routeFilter = (route: RouteObject) => {
      const { handle } = route;
      // 抽出角色
      const { roles } = handle || {};
      if (!roles) return true;
      // 进行角色权限判断
      return roleList.some((role) => roles.includes(role));
    };

    const routeRemoveIgnoreFilter = (route: RouteObject) => {
      const { handle } = route;
      // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
      const { ignoreRoute } = handle || {};
      // arr.filter 返回 true 表示该元素通过测试
      return !ignoreRoute;
    };

    /**
     * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
     * */
    const patchHomeAffix = (routes: RouteObject[]) => {
      if (!routes || routes.length === 0) return;
      let homePath: string = userInfo.homePath || PageEnum.BASE_HOME;

      function patcher(routes: RouteObject[], parentPath = '') {
        if (parentPath) parentPath = parentPath + '/';
        routes.forEach((route: RouteObject) => {
          const { path, children, handle } = route;
          const currentPath = path!.startsWith('/') ? path : parentPath + path;
          if (currentPath === homePath) {
            if (handle.redirect) {
              homePath = handle.redirect! as string;
            } else {
              route.handle = Object.assign({}, route.handle, { affix: true });
              throw new Error('end');
            }
          }
          children && children.length > 0 && patcher(children, currentPath);
        });
      }

      try {
        patcher(routes);
      } catch (e) {
        // 已处理完毕跳出循环
      }
      return;
    };

    switch (permissionMode) {
      // // TODO 角色权限
      // case PermissionModeEnum.ROLE:
      //   // 对非一级路由进行过滤
      //   routes = filter(asyncRoutes, routeFilter);
      //   // 对一级路由根据角色权限过滤
      //   routes = routes.filter(routeFilter);
      //   // Convert multi-level routing to level 2 routing
      //   // 将多级路由转换为 2 级路由
      //   routes = flatMultiLevelRoutes(routes);
      //   break;
      // 路由映射， 默认进入该case
      case PermissionModeEnum.ROUTE_MAPPING:
        // 对非一级路由进行过滤
        routes = filter(asyncRoutes, routeFilter);
        // 对一级路由再次根据角色权限过滤
        routes = routes.filter(routeFilter);
        // 将路由转换成菜单
        const menuList = transformRouteToMenu(routes, true);
        // 移除掉 ignoreRoute: true 的路由 非一级路由
        routes = filter(routes, routeRemoveIgnoreFilter);
        // 移除掉 ignoreRoute: true 的路由 一级路由；
        routes = routes.filter(routeRemoveIgnoreFilter);
        // 对菜单进行排序
        menuList.sort((a, b) => {
          return (a.handle?.orderNo || 0) - (b.handle?.orderNo || 0);
        });
        console.log(menuList, routes);
        // 设置菜单列表
        setFrontMenuList(menuList);

        // Convert multi-level routing to level 2 routing
        // 将多级路由转换为 2 级路由
        routes = flatMultiLevelRoutes(routes);
        break;

      // //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
      // //  TODO 如果确定不需要做后台动态权限，请在下方注释整个判断
      // case PermissionModeEnum.BACK:
      //   const { createMessage } = useMessage();

      //   createMessage.loading({
      //     content: t('sys.app.menuLoading'),
      //     duration: 1,
      //   });

      //   // !Simulate to obtain permission codes from the background,
      //   // 模拟从后台获取权限码，
      //   // this function may only need to be executed once, and the actual project can be put at the right time by itself
      //   // 这个功能可能只需要执行一次，实际项目可以自己放在合适的时间
      //   let routeList: AppRouteRecordRaw[] = [];
      //   try {
      //     await this.changePermissionCode();
      //     routeList = (await getMenuList()) as AppRouteRecordRaw[];
      //   } catch (error) {
      //     console.error(error);
      //   }

      //   // Dynamically introduce components
      //   // 动态引入组件
      //   routeList = transformObjToRoute(routeList);

      //   //  Background routing to menu structure
      //   //  后台路由到菜单结构
      //   const backMenuList = transformRouteToMenu(routeList);
      //   this.setBackMenuList(backMenuList);

      //   // remove meta.ignoreRoute item
      //   // 删除 meta.ignoreRoute 项
      //   routeList = filter(routeList, routeRemoveIgnoreFilter);
      //   routeList = routeList.filter(routeRemoveIgnoreFilter);

      //   routeList = flatMultiLevelRoutes(routeList);
      //   routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
      //   break;
    }

    routes.push(ERROR_LOG_ROUTE);
    patchHomeAffix(routes);
    console.log(routes);
    setRouterList(routes);
    return routes;
  },
}));

export const usePermissionStoreActions = () => {
  return usePermissionStore(
    useShallow((state) => ({
      setPermCodeList: state.setPermCodeList,
      setBackMenuList: state.setBackMenuList,
      setFrontMenuList: state.setFrontMenuList,
      setLastBuildMenuTime: state.setLastBuildMenuTime,
      setDynamicAddedRoute: state.setDynamicAddedRoute,
      resetState: state.resetState,
      changePermissionCode: state.changePermissionCode,
      buildRoutes: state.buildRoutes,
      setRouterList: state.setRouterList,
    })),
  );
};
