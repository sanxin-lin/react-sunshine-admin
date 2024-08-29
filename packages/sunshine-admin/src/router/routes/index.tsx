import { Navigate, type RouteObject } from 'react-router-dom';

import { createAysncComponent } from '@/utils/component';

import { LOGIN_ROUTE_ID, ROOT_ROUTE_ID } from '../constants';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from './basic';

// TODO mainOutRoutes
// import { mainOutRoutes } from './mainOut';
import { Recordable } from '#/global';

// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts', { eager: true });
const routeModuleList: RouteObject[] = [];
console.log(modules);
// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [...routeModuleList];

const ROOT_ROUTE: RouteObject = {
  path: '/',
  id: ROOT_ROUTE_ID,
  handle: {
    title: ROOT_ROUTE_ID,
  },
  element: <Navigate to="/login" />,
};

const LOGIN_ROUTE: RouteObject = {
  path: '/login',
  id: LOGIN_ROUTE_ID,
  element: createAysncComponent(() => import('@/views/sys/login/Login')),
  handle: {
    title: LOGIN_ROUTE_ID,
  },
};

// Basic routing without permission
// 基本路由
export const basicRoutes = [ROOT_ROUTE, LOGIN_ROUTE, REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE];
