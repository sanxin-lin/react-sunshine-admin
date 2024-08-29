import { createAysncComponent } from '@/utils/component';

export const LOGIN_ROUTE_ID = 'Login';

export const ROOT_ROUTE_ID = 'Root';

export const REDIRECT_ROUTE_ID = 'Redirect';

export const PARENT_LAYOUT_ROUTE_ID = 'ParentLayout';

export const PAGE_NOT_FOUND_ROUTE_ID = 'PageNotFound';

// 根组件 Route 的 uid
export const ROOT_UNIQUE_ID = 'root';

export const Layout = createAysncComponent(() => import('@/layouts/default/Index'));
