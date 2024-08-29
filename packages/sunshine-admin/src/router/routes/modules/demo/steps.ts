import { RouteObject } from 'react-router-dom';

import { Layout } from '@/router/constants';
import { createAysncComponent } from '@/utils/component';

const steps: RouteObject = {
  path: '/steps/index',
  id: 'StepsDemo',
  element: Layout,
  handle: {
    orderNo: 90000,
    hideChildrenInMenu: true,
    icon: 'whh:paintroll',
    title: 'routes.demo.steps.page',
    level: 1,
  },
  children: [
    {
      path: '',
      id: 'StepsDemoPage',
      element: createAysncComponent(() => import('@/views/demo/steps/Index')),
      handle: {
        title: 'routes.demo.steps.page',
        icon: 'whh:paintroll',
        hideMenu: true,
      },
    },
  ],
};

export default steps;
