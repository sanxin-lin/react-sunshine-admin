import type { RouteObject } from 'react-router-dom';

import { translatorWithout } from '@/locales';
import { createAysncComponent } from '@/utils/component';

import { PAGE_NOT_FOUND_ROUTE_ID, REDIRECT_ROUTE_ID } from '../constants';

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: RouteObject = {
  path: '/:path(.*)*',
  id: PAGE_NOT_FOUND_ROUTE_ID,
  element: createAysncComponent(() => import('@/layouts/default/Index')),
  handle: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hidden: true,
  },
  // children: [
  //   {
  //     path: '/:path(.*)*',
  //     id: PAGE_NOT_FOUND_ROUTE_ID,
  //     element: createAysncComponent(<ExceptionPage />),
  //     handle: {
  //       title: 'ErrorPage',
  //       hideBreadcrumb: true,
  //       hidden: true,
  //     },
  //   },
  // ],
};

export const REDIRECT_ROUTE: RouteObject = {
  path: '/redirect',
  element: createAysncComponent(() => import('@/layouts/default/Index')),
  id: 'RedirectTo',
  handle: {
    title: REDIRECT_ROUTE_ID,
    hideBreadcrumb: true,
    hidden: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)/:_redirect_type(.*)/:_origin_params(.*)?',
      id: REDIRECT_ROUTE_ID,
      element: createAysncComponent(() => import('@/views/sys/redirect/Redirect')),
      handle: {
        title: REDIRECT_ROUTE_ID,
        hideBreadcrumb: true,
      },
    },
  ],
};

export const ERROR_LOG_ROUTE: RouteObject = {
  path: '/error-log',
  id: 'ErrorLog',
  element: createAysncComponent(() => import('@/layouts/default/Index')),
  handle: {
    redirect: '/error-log/list',
    title: 'ErrorLog',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'list',
      id: 'ErrorLogList',
      element: createAysncComponent(() => import('@/views/sys/error-log/ErrorLog')),
      handle: {
        title: translatorWithout('routes.basic.errorLogList'),
        hideBreadcrumb: true,
        currentActiveMenu: '/error-log',
      },
    },
  ],
};
