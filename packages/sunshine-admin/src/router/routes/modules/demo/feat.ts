import { RouteObject } from 'react-router-dom';

import { Layout } from '@/router/constants';
import { createAysncComponent } from '@/utils/component';

const feat: RouteObject = {
  path: '/feat',
  id: 'FeatDemo',
  element: Layout,
  handle: {
    orderNo: 19,
    icon: 'ion:git-compare-outline',
    title: 'routes.demo.feat.feat',
    level: 1,
  },

  children: [
    {
      path: 'icon',
      id: 'IconDemo',
      element: createAysncComponent(() => import('@/views/demo/feat/icon/Index')),
      handle: {
        title: 'routes.demo.feat.icon',
      },
    },
    {
      path: 'session-timeout',
      id: 'SessionTimeout',
      element: createAysncComponent(() => import('@/views/demo/feat/session-timeout/Index')),
      handle: {
        title: 'routes.demo.feat.sessionTimeout',
      },
    },
    {
      path: 'print',
      id: 'Print',
      element: createAysncComponent(() => import('@/views/demo/feat/print/Index')),
      handle: {
        title: 'routes.demo.feat.print',
      },
    },
  ],
};

export default feat;
