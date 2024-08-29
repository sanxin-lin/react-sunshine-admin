import { RouteObject } from 'react-router-dom';

import { Layout } from '@/router/constants';
import { createAysncComponent } from '@/utils/component';

const steps: RouteObject = {
  path: '/flow',
  id: 'FlowDemo',
  element: Layout,
  handle: {
    level: 1,
    orderNo: 5000,
    icon: 'tabler:chart-dots',
    title: 'routes.demo.flow.name',
  },
  children: [
    {
      path: 'flowChart',
      id: 'flowChartDemo',
      element: createAysncComponent(() => import('@/views/demo/comp/flow-chart/Index')),
      handle: {
        title: 'routes.demo.flow.flowChart',
      },
    },
  ],
};

export default steps;
