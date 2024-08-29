import { RouteObject } from 'react-router-dom';

import { createAysncComponent } from '@/utils/component';

const about: RouteObject = {
  path: '/about',
  id: 'About',
  element: createAysncComponent(() => import('@/layouts/default/Index')),
  handle: {
    redirect: '/dashboard/analysis',
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: 'routes.dashboard.about',
    level: 1,
  },
};

export default about;
