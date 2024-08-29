import { RouteObject } from 'react-router-dom';
import { useCreation } from 'ahooks';
import { uniqBy } from 'lodash-es';

import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
// import { useDynamicRouter } from '@/hooks/web/useDynamicRouter';
import { useRouterMatched } from '@/hooks/web/useRouterMatched';
// import { useMultipleTabStore } from '@/stores/modules/multipleTab';

export const useFrameKeepAlive = () => {
  // const { routes } = useDynamicRouter();
  const { matches } = useRouterMatched();
  const { currentRoute } = useRouterMatched();
  const { show } = useMultipleTabSetting();
  // const tabs = useMultipleTabStore((state) => state.tabs);
  // TODO 保障 iframe 不重载，而是 Keep alive
  const openTabList = useCreation(() => {
    return matches.reduce((prev: string[], next) => {
      if (next.handle && Reflect.has(next.handle, 'frameSrc')) {
        prev.push(next.id as string);
      }
      return prev;
    }, []);
  }, [matches]);

  const getAllFramePages = (routes: RouteObject[]): RouteObject[] => {
    let res: RouteObject[] = [];
    for (const route of routes) {
      const { handle: { frameSrc } = {}, children } = route;
      if (frameSrc) {
        res.push(route);
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children));
      }
    }
    res = uniqBy(res, 'id');
    return res;
  };

  const framePages = useCreation(() => {
    const ret = getAllFramePages(matches as unknown as RouteObject[]) || [];
    return ret;
  }, [matches]);
  const checkIsShowIframe = (item: RouteObject) => {
    return item.id === currentRoute.id;
  };
  const checkHasRenderFrame = (id: string | undefined) => {
    if (!id) return false;
    if (!show) {
      return currentRoute.id === id;
    }
    return openTabList.includes(id);
  };

  return {
    checkHasRenderFrame,
    checkIsShowIframe,
    getAllFramePages,
    framePages,
    openTabList,
  };
};
