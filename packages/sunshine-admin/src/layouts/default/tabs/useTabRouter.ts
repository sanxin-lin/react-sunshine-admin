import { UIMatch } from 'react-router-dom';

import { useGo } from '@/hooks/web/usePage';
import { useRouterListener } from '@/hooks/web/useRouterListener';
import { useMultipleTabStore, useMultipleTabStoreActions } from '@/stores/modules/multipleTab';

import { Tab } from '#/router';

export const useTabRouter = () => {
  const go = useGo();
  const { addTab, updateCurrentTabId } = useMultipleTabStoreActions();
  const { tabs, currentTabId } = useMultipleTabStore((state) => ({
    tabs: state.tabs,
    currentTabId: state.currentTabId,
  }));

  const updateCurrentTabIdFn = (id: string) => {
    updateCurrentTabId(id);
    const target = tabs.find((tab) => tab.id === id);
    if (!target) return;
    go(target.path);
  };

  const addTabFn = (currentRoute: UIMatch<unknown, unknown>) => {
    if (!currentRoute) return;
    const handle = (currentRoute.handle ?? {}) as Tab['handle'];
    addTab({
      id: currentRoute.id,
      name: handle.title,
      path: currentRoute.pathname,
      handle,
      parentId: handle.parentId,
      icon: handle.icon,
    });
  };

  useRouterListener((matches) => {
    const { currentRoute } = matches;
    addTabFn(currentRoute);
  });

  return {
    currentTabId,
    tabs,
    updateCurrentTabId: updateCurrentTabIdFn,
  };
};
