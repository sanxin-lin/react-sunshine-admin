import { create } from 'zustand';

import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum, TriggerEnum } from '@/enums/menuEnum';
import { useAppStore, useAppStoreActions } from '@/stores/modules/app';

import { useFullContent } from '../web/useFullContent';

const useMixSideHasChildren = create(() => ({
  value: false,
  set(v: boolean) {
    this.value = v;
  },
}));

export const useMenuSetting = () => {
  const { fullContent } = useFullContent();
  const projectConfig = useAppStore((state) => state.getProjectConfig());
  const { setMenuSetting } = useAppStoreActions();
  const mixSideHasChildren = useMixSideHasChildren();

  const setMixSideHasChildren = (v: boolean) => {
    mixSideHasChildren.set(v);
  };
  const menuSetting = projectConfig.menuSetting ?? {};

  const {
    split,
    show,
    mode,
    type,
    hidden,
    trigger,
    collapsed,
    siderHidden,
    collapsedShowTitle,
    mixSideFixed,
    menuWidth,
  } = menuSetting;

  const showSidebar = split || (show && mode !== MenuModeEnum.HORIZONTAL && !fullContent);

  const showHeaderTrigger = (() => {
    if (type === MenuTypeEnum.TOP_MENU || !show || hidden) return false;
    return trigger === TriggerEnum.HEADER;
  })();

  const isHorizontal = mode === MenuModeEnum.HORIZONTAL;

  const isMixSidebar = type === MenuTypeEnum.MIX_SIDEBAR;

  const isMixMode = mode === MenuModeEnum.INLINE && type === MenuTypeEnum.MIX;

  const isSidebarType = type === MenuTypeEnum.SIDEBAR;

  const isTopMenu = type === MenuTypeEnum.TOP_MENU;

  const showTopMenu = projectConfig.menuSetting.mode === MenuModeEnum.HORIZONTAL || split;

  const miniWidthNumber = siderHidden
    ? 0
    : collapsedShowTitle
      ? SIDE_BAR_SHOW_TIT_MINI_WIDTH
      : SIDE_BAR_MINI_WIDTH;

  const realWidth = (() => {
    if (isMixSidebar) {
      return collapsed && !mixSideFixed ? miniWidthNumber : menuWidth;
    }
    return collapsed ? miniWidthNumber : menuWidth;
  })();

  const calcContentWidth = (() => {
    const width =
      isTopMenu || !show || (split && hidden)
        ? 0
        : isMixSidebar
          ? (collapsed ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH) +
            (mixSideFixed && mixSideHasChildren.value ? realWidth : 0)
          : realWidth;

    return `calc(100% - ${width}px)`;
  })();

  const toggleCollapsed = () => {
    setMenuSetting({
      collapsed: !collapsed,
    });
  };

  return {
    ...menuSetting,
    showSidebar,
    realWidth,
    showHeaderTrigger,
    isMixSidebar,
    isHorizontal,
    isMixMode,
    miniWidthNumber,
    isSidebarType,
    isTopMenu,
    showTopMenu,
    calcContentWidth,
    setMixSideHasChildren,
    setMenuSetting,
    toggleCollapsed,
  };
};
