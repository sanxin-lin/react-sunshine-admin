import { useRouterEmitterEvents } from '@/hooks/web/routerEmitterEvents';

import { initGuard } from './guard';

export const initRouter = () => {
  useRouterEmitterEvents();
  initGuard();
};
