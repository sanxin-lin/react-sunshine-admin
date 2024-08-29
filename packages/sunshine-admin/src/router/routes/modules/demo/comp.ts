import { RouteObject } from 'react-router-dom';

import { Layout } from '@/router/constants';
import { createAysncComponent } from '@/utils/component';

const feat: RouteObject = {
  path: '/comp',
  id: 'Comp',
  element: Layout,
  handle: {
    orderNo: 30,
    icon: 'ion:layers-outline',
    title: 'routes.demo.comp.comp',
    level: 1,
  },

  children: [
    {
      path: 'basic',
      id: 'BasicDemo',
      element: createAysncComponent(() => import('@/views/demo/comp/button/Index')),
      handle: {
        title: 'routes.demo.comp.basic',
        level: 2,
      },
    },
    {
      path: 'form',
      id: 'FormDemo',
      handle: {
        title: 'routes.demo.form.form',
        level: 2,
      },
      children: [
        {
          path: 'basic',
          id: 'FormBasicDemo',
          element: createAysncComponent(() => import('@/views/demo/comp/form/Basic')),
          handle: {
            title: 'routes.demo.form.basic',
          },
        },
      ],
    },
    {
      path: 'table',
      id: 'TableDemo',
      handle: {
        title: 'routes.demo.table.table',
        level: 2,
      },
      children: [
        {
          path: 'basic',
          id: 'TableBasicDemo',
          element: createAysncComponent(() => import('@/views/demo/comp/table/Basic')),
          handle: {
            title: 'routes.demo.table.basic',
          },
        },
        {
          path: 'treeTable',
          id: 'TreeTableDemo',
          element: createAysncComponent(() => import('@/views/demo/comp/table/TreeTable')),
          handle: {
            title: 'routes.demo.table.treeTable',
          },
        },
      ],
    },
    {
      path: 'timestamp',
      id: 'TimeDemo',
      element: createAysncComponent(() => import('@/views/demo/comp/time/Index')),
      handle: {
        title: 'routes.demo.comp.time',
        level: 2,
      },
    },
    {
      path: 'countTo',
      id: 'CountTo',
      element: createAysncComponent(() => import('@/views/demo/comp/count-to/Index')),
      handle: {
        title: 'routes.demo.comp.countTo',
        level: 2,
      },
    },
    {
      path: 'modal',
      id: 'ModalDemo',
      element: createAysncComponent(() => import('@/views/demo/comp/modal/Index')),
      handle: {
        title: 'routes.demo.comp.modal',
        level: 2,
      },
    },
    {
      path: 'drawer',
      id: 'DrawerDemo',
      element: createAysncComponent(() => import('@/views/demo/comp/drawer/Index')),
      handle: {
        title: 'routes.demo.comp.drawer',
        level: 2,
      },
    },
    {
      path: 'qrcode',
      id: 'QrCodeDemo',
      element: createAysncComponent(() => import('@/views/demo/comp/qrcode/Index')),
      handle: {
        title: 'routes.demo.comp.qrcode',
        level: 2,
      },
    },
    {
      path: 'strength-meter',
      id: 'StrengthMeterDemo',
      element: createAysncComponent(() => import('@/views/demo/comp/strength-meter/Index')),
      handle: {
        title: 'routes.demo.comp.strength',
        level: 2,
      },
    },
    {
      path: 'loading',
      id: 'LoadingDemo',
      element: createAysncComponent(() => import('@/views/demo/comp/loading/Index')),
      handle: {
        title: 'routes.demo.comp.loading',
        level: 2,
      },
    },
  ],
};

export default feat;
