import { uniqueId } from 'lodash-es';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { MULTIPLE_TABS_KEY } from '@/enums/cacheEnum';
import { PageEnum } from '@/enums/pageEnum';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic';
import projectSetting from '@/settings/projectSetting';
import { Persistent } from '@/utils/cache/persistent';

import { Nullable } from '#/global';
import { Tab } from '#/router';

const cacheTab = projectSetting.multiTabsSetting.cache;

export interface MultipleTabState {
  cacheTabIds: Set<string>;
  tabs: Tab[];
  lastDragEndIndex: number;
  currentTabId: string;
  refreshKey: string;

  getCachedTabList(): string[];
  getCurrentTab(): Nullable<Tab>;

  addTab(tab: Tab): void;
  updateCacheTab(): void;
  updateCurrentTabId(id: string): void;
  clearCacheTabs(): void;
  resetState(): void;
  closeAllTab(): void;
  updateRefreshKey(): void;
  closeTab(tab: Tab, afterClose: (nextPath: string) => void): void;
  closeTabById(id: string, afterClose: (nextPath: string) => void): void;
  closeRightTabs(tab: Tab): void;
  closeLeftTabs(tab: Tab): void;
  closeOtherTabs(tab: Tab): void;
}

export const useMultipleTabStore = create<MultipleTabState>((set, get) => ({
  // Tabs that need to be cached
  cacheTabIds: new Set(),
  // multiple tab list
  tabs: cacheTab ? Persistent.getLocal(MULTIPLE_TABS_KEY) || [] : [],
  // Index of the last moved tab
  lastDragEndIndex: 0,
  currentTabId: '',

  refreshKey: uniqueId(),

  updateRefreshKey() {
    set({ refreshKey: uniqueId() });
  },

  getCachedTabList() {
    return Array.from(get().cacheTabIds);
  },
  getCurrentTab() {
    const { currentTabId, tabs } = get();
    return tabs.find((tab) => tab.id === currentTabId) ?? null;
  },

  updateCacheTab() {
    const { tabs } = get();
    const idMap: Set<string> = new Set();

    for (const tab of tabs) {
      // Ignore the cache
      const needCache = !tab.handle?.ignoreKeepAlive;
      if (!needCache) {
        continue;
      }
      const id = tab.id as string;
      idMap.add(id);
    }
    set({ cacheTabIds: idMap });
  },
  clearCacheTabs() {
    set({ cacheTabIds: new Set() });
  },
  updateCurrentTabId(id) {
    set({ currentTabId: id });
  },
  addTab(tab) {
    const { path, id } = tab;
    const { tabs, updateCurrentTabId } = get();

    if (
      path === PageEnum.ERROR_PAGE ||
      path === PageEnum.BASE_LOGIN ||
      !id ||
      [REDIRECT_ROUTE.id, PAGE_NOT_FOUND_ROUTE.id].includes(id as string)
    ) {
      return;
    }

    const targetIndex = tabs.findIndex((tab) => tab.id === id);
    if (targetIndex !== -1) {
      const targetCurrentTab = tabs[targetIndex];
      if (!targetCurrentTab) return;
      updateCurrentTabId(targetCurrentTab.id);
    } else {
      // TODO Add tab
      //   // Add tab
      //   // 获取动态路由打开数，超过 0 即代表需要控制打开数
      //   const dynamicLevel = meta?.dynamicLevel ?? -1;
      //   if (dynamicLevel > 0) {
      //     // 如果动态路由层级大于 0 了，那么就要限制该路由的打开数限制了
      //     // 首先获取到真实的路由，使用配置方式减少计算开销.
      //     // const realName: string = path.match(/(\S*)\//)![1];
      //     const realPath = meta?.realPath ?? '';
      //     // 获取到已经打开的动态路由数, 判断是否大于某一个值
      //     if (
      //       this.tabList.filter((e) => e.meta?.realPath ?? '' === realPath).length >= dynamicLevel
      //     ) {
      //       // 关闭第一个
      //       const index = this.tabList.findIndex((item) => item.meta.realPath === realPath);
      //       index !== -1 && this.tabList.splice(index, 1);
      //     }
      //   }
      set({ tabs: [...tabs, tab] });
      updateCurrentTabId(tab.id);
    }
    cacheTab && Persistent.setLocal(MULTIPLE_TABS_KEY, [...tabs, tab]);
  },
  resetState() {
    set({ tabs: [], cacheTabIds: new Set() });
  },
  closeTab(tabItem, afterClose) {
    const { tabs, updateCacheTab, currentTabId } = get();
    if (!tabItem) return;
    const { handle } = tabItem;
    if (handle.affix) return;
    const newTabs = tabs.filter((tab) => tab.id !== tabItem.id);
    set({
      tabs: newTabs,
    });
    updateCacheTab();
    if (tabItem.id === currentTabId) {
      const index = tabs.findIndex((tab) => tab.id === tab.id);
      // 0 的话下一个还是 0，非 0 下一个是前一个
      const nextIndex = index === 0 ? 0 : index - 1;
      const nextTab = newTabs[nextIndex];
      if (!nextTab) return;
      afterClose(nextTab.path);
    }
  },
  closeTabById(id, afterClose) {
    const { closeTab, tabs } = get();
    const tab = tabs.find((tab) => tab.id === id);
    if (!tab) return;
    closeTab(tab, afterClose);
  },
  closeLeftTabs(tabItem) {
    const { tabs, updateCacheTab, currentTabId } = get();
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
    const index = tabs.findIndex((tab) => tab.id === tabItem.id);
    if (index === 0 || currentIndex !== index) return;
    const newTab = tabs.filter((tab, i) => i >= index && !tab.handle.affix);
    set({
      tabs: newTab,
    });
    updateCacheTab();
  },
  closeRightTabs(tabItem) {
    const { tabs, updateCacheTab, currentTabId } = get();
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
    const index = tabs.findIndex((tab) => tab.id === tabItem.id);
    if (index === tabs.length || currentIndex !== index) return;
    const newTab = tabs.filter((tab, i) => i <= index && !tab.handle.affix);
    set({
      tabs: newTab,
    });
    updateCacheTab();
  },
  closeOtherTabs(tabItem) {
    const { tabs, updateCacheTab, currentTabId } = get();
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
    const index = tabs.findIndex((tab) => tab.id === tabItem.id);
    if (currentIndex !== index) return;
    const newTab = tabs.filter((tab, i) => i === index && !tab.handle.affix);
    set({
      tabs: newTab,
    });
    updateCacheTab();
  },
  closeAllTab() {
    const { tabs } = get();
    set({
      tabs: tabs.filter((item) => item?.handle?.affix ?? false),
      cacheTabIds: new Set(),
    });
  },
}));

export const useMultipleTabStoreActions = () => {
  return useMultipleTabStore(
    useShallow((state) => ({
      updateCacheTab: state.updateCacheTab,
      addTab: state.addTab,
      updateCurrentTabId: state.updateCurrentTabId,
      closeAllTab: state.closeAllTab,
      updateRefreshKey: state.updateRefreshKey,
      closeTab: state.closeTab,
      closeLeftTabs: state.closeLeftTabs,
      closeRightTabs: state.closeRightTabs,
      closeOtherTabs: state.closeOtherTabs,
      closeTabById: state.closeTabById,
      resetState: state.resetState,
    })),
  );
};
