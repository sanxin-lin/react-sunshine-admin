import { useCreation } from 'ahooks';

import type { DropMenu } from '@/components/Dropdown';
import { useLocale } from '@/hooks/web/useLocale';
import { useRouterMatched } from '@/hooks/web/useRouterMatched';
import { useMultipleTabStore } from '@/stores/modules/multipleTab';

import { MenuEventEnum } from './types';
import { useTabs } from './useTabs';

import { Tab } from '#/router';

export const useTabDropdown = (tab: Tab) => {
  const { refreshPage, closeCurrent, closeAll, closeLeft, closeRight, closeOther } = useTabs();
  const { currentRoute } = useRouterMatched();
  const { tabs, lastDragEndIndex, currentTabId } = useMultipleTabStore((state) => ({
    tabs: state.tabs,
    lastDragEndIndex: state.lastDragEndIndex,
    currentTabId: state.currentTabId,
  }));
  const { t } = useLocale();
  const dropMenuList = useCreation((): DropMenu[] => {
    if (!currentRoute) return [];
    const isCurrent = tab.id === currentTabId;
    const disabled = tabs.length <= 1;
    const index = tabs.findIndex((item) => item.id === tab.id);
    const closeLeftDisabled = index === 0 || !isCurrent || disabled;
    const closeRightDisabled =
      (index === tabs.length - 1 && lastDragEndIndex >= 0) || !isCurrent || disabled;
    const handle = currentRoute.handle as Tab['handle'];
    const affix = handle.affix;
    return [
      {
        icon: 'ion:reload-sharp',
        event: MenuEventEnum.REFRESH_PAGE,
        text: t('layout.multipleTab.reload'),
        disabled: !isCurrent,
      },
      {
        icon: 'clarity:close-line',
        event: MenuEventEnum.CLOSE_CURRENT,
        text: t('layout.multipleTab.close'),
        disabled: !!affix || disabled,
        divider: true,
      },
      {
        icon: 'line-md:arrow-close-left',
        event: MenuEventEnum.CLOSE_LEFT,
        text: t('layout.multipleTab.closeLeft'),
        disabled: closeLeftDisabled,
        divider: false,
      },
      {
        icon: 'line-md:arrow-close-right',
        event: MenuEventEnum.CLOSE_RIGHT,
        text: t('layout.multipleTab.closeRight'),
        disabled: closeRightDisabled,
        divider: true,
      },
      {
        icon: 'dashicons:align-center',
        event: MenuEventEnum.CLOSE_OTHER,
        text: t('layout.multipleTab.closeOther'),
        disabled: !isCurrent || disabled,
      },
      {
        icon: 'clarity:minus-line',
        event: MenuEventEnum.CLOSE_ALL,
        text: t('layout.multipleTab.closeAll'),
        disabled: disabled,
      },
    ];
  }, [currentRoute, t, currentTabId, tab, lastDragEndIndex]);

  const handleContextMenu = (e: Event, tabItem: Tab) => {
    if (!tabItem) {
      return;
    }
    e?.preventDefault();
  };

  // Handle right click event
  const handleMenuEvent = (menu: DropMenu): void => {
    const { event } = menu;
    switch (event) {
      case MenuEventEnum.REFRESH_PAGE:
        // refresh page
        refreshPage();
        break;
      // Close current
      case MenuEventEnum.CLOSE_CURRENT:
        closeCurrent(tab);
        break;
      // Close left
      case MenuEventEnum.CLOSE_LEFT:
        console.log(tab);
        closeLeft(tab);
        break;
      // Close right
      case MenuEventEnum.CLOSE_RIGHT:
        closeRight(tab);
        break;
      // Close other
      case MenuEventEnum.CLOSE_OTHER:
        closeOther(tab);
        break;
      // Close all
      case MenuEventEnum.CLOSE_ALL:
        closeAll();
        break;
    }
  };
  return { dropMenuList, handleMenuEvent, handleContextMenu };
};
