import { RouteObject } from 'react-router-dom';

import { Layout } from '@/router/constants';
import { createAysncComponent } from '@/utils/component';

const charts: RouteObject = {
  path: '/charts',
  id: 'Charts',
  element: Layout,
  handle: {
    orderNo: 500,
    icon: 'ion:bar-chart-outline',
    title: 'routes.demo.charts.charts',
    level: 1,
  },
  children: [
    {
      path: 'baiduMap',
      id: 'BaiduMap',
      handle: {
        title: 'routes.demo.charts.baiduMap',
        level: 2,
      },
      element: createAysncComponent(() => import('@/views/demo/charts/map/Baidu')),
    },
    {
      path: 'aMap',
      id: 'AMap',
      handle: {
        title: 'routes.demo.charts.aMap',
        level: 2,
      },
      element: createAysncComponent(() => import('@/views/demo/charts/map/Gaode')),
    },
    {
      path: 'googleMap',
      id: 'GoogleMap',
      handle: {
        title: 'routes.demo.charts.googleMap',
        level: 2,
      },
      element: createAysncComponent(() => import('@/views/demo/charts/map/Google')),
    },

    {
      path: 'echarts',
      id: 'Echarts',
      handle: {
        title: 'Echarts',
        level: 2,
      },
      children: [
        {
          path: 'map',
          id: 'Map',
          element: createAysncComponent(() => import('@/views/demo/charts/Map')),
          handle: {
            title: 'routes.demo.charts.map',
          },
        },
        {
          path: 'line',
          id: 'Line',
          element: createAysncComponent(() => import('@/views/demo/charts/Line')),
          handle: {
            title: 'routes.demo.charts.line',
          },
        },
        {
          path: 'pie',
          id: 'Pie',
          element: createAysncComponent(() => import('@/views/demo/charts/Pie')),
          handle: {
            title: 'routes.demo.charts.pie',
          },
        },
      ],
    },
  ],
};

export default charts;
