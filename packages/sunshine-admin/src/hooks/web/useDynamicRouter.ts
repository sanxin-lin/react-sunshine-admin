import { createHashRouter } from 'react-router-dom';
import { useCreation } from 'ahooks';

import { asyncRoutes, basicRoutes } from '@/router';
import { usePermissionStore } from '@/stores/modules/permission';

export const useDynamicRouter = () => {
  const routeList = usePermissionStore((state) => state.routerList);
  const routes = [...basicRoutes, ...asyncRoutes];
  // console.log([...basicRoutes, ...routerList]);
  const router = useCreation(() => {
    // TODO useDynamicRouter
    return createHashRouter(routes);
  }, []);

  return { router, routes };
};
