import { RouteObject } from 'react-router-dom';

import { Layout } from '@/router/constants';
import { createAysncComponent } from '@/utils/component';

const iframe: RouteObject = {
  path: '/iframe',
  id: 'Frame',
  element: Layout,
  handle: {
    orderNo: 1000,
    icon: 'ion:tv-outline',
    title: 'routes.demo.iframe.frame',
    level: 1,
  },
  children: [
    {
      path: 'doc',
      id: 'Doc',
      element: createAysncComponent(() => import('@/views/sys/iframe/FrameBlank')),
      handle: {
        frameSrc: 'https://doc.vvbin.cn/',
        title: 'routes.demo.iframe.doc',
      },
    },
    {
      path: 'antd',
      id: 'Antv',
      element: createAysncComponent(() => import('@/views/sys/iframe/FrameBlank')),
      handle: {
        frameSrc: 'https://ant-design.antgroup.com',
        title: 'routes.demo.iframe.antd',
      },
    },
    {
      path: 'https://ant-design.antgroup.com/',
      id: 'DocExternal',
      element: createAysncComponent(() => import('@/views/sys/iframe/FrameBlank')),
      handle: {
        title: 'routes.demo.iframe.docExternal',
      },
    },
  ],
};

export default iframe;
