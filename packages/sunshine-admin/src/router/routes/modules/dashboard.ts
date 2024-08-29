import { RouteObject } from 'react-router-dom';

import { Layout } from '@/router/constants';
import { createAysncComponent } from '@/utils/component';

const dashboard: RouteObject = {
  path: '/dashboard',
  id: 'Dashboard',
  element: Layout,
  handle: {
    redirect: '/dashboard/analysis',
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: 'routes.dashboard.dashboard',
    level: 1,
  },
  children: [
    {
      path: 'analysis',
      id: 'Analysis',
      element: createAysncComponent(() => import('@/views/dashboard/analysis/Index')),
      handle: {
        title: 'routes.dashboard.analysis',
      },
    },
    {
      path: 'workbench',
      id: 'Workbench',
      element: createAysncComponent(() => import('@/views/dashboard/workbench/Index')),
      handle: {
        title: 'routes.dashboard.workbench',
      },
    },
  ],
};

export default dashboard;
