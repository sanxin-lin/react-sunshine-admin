import { MenuTypeEnum } from '@/enums/menuEnum';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import projectSetting from '@/settings/projectSetting';
import { useAppStoreActions } from '@/stores/modules/app';
import { updateColorWeak } from '@/theme/updateColorWeak';
import { updateGrayMode } from '@/theme/updateGrayMode';

import { HandlerEnum } from './enum';

import { ProjectConfig } from '#/config';
import { DeepPartial } from '#/global';

export const useSettingsHandler = () => {
  const { setPageLoading, setProjectConfig } = useAppStoreActions();
  const { themeColor, themeMode, updateRootTheme, updateHeaderBgColor, updateSidebarBgColor } =
    useRootSetting();
  const { menuSetting } = projectSetting;

  const getConfig = (event: HandlerEnum, value: any): DeepPartial<ProjectConfig> => {
    switch (event) {
      case HandlerEnum.CHANGE_LAYOUT:
        const { mode, type, split } = value;
        const isMixSidebar = type === MenuTypeEnum.MIX;
        const mixSideSplitOpt =
          menuSetting.type === MenuTypeEnum.MIX ? { split: menuSetting.split } : { split };
        const otherSplitOpt = { split: false };
        const splitOpt = isMixSidebar ? mixSideSplitOpt : otherSplitOpt;

        return {
          menuSetting: {
            mode,
            type,
            collapsed: false,
            show: true,
            hidden: false,
            ...splitOpt,
          },
        };

      case HandlerEnum.CHANGE_THEME_COLOR:
        if (themeColor === value) {
          return {};
        }

        return { themeColor: value };

      case HandlerEnum.CHANGE_THEME:
        if (themeMode === value) {
          return {};
        }
        updateRootTheme(value);

        return {};

      case HandlerEnum.MENU_HAS_DRAG:
        return { menuSetting: { canDrag: value } };

      case HandlerEnum.MENU_ACCORDION:
        return { menuSetting: { accordion: value } };

      case HandlerEnum.MENU_TRIGGER:
        return { menuSetting: { trigger: value } };

      case HandlerEnum.MENU_TOP_ALIGN:
        return { menuSetting: { topMenuAlign: value } };

      case HandlerEnum.MENU_COLLAPSED:
        return { menuSetting: { collapsed: value } };

      case HandlerEnum.MENU_WIDTH:
        return { menuSetting: { menuWidth: value } };

      case HandlerEnum.MENU_SHOW_SIDEBAR:
        return { menuSetting: { show: value } };

      case HandlerEnum.MENU_COLLAPSED_SHOW_TITLE:
        return { menuSetting: { collapsedShowTitle: value } };

      case HandlerEnum.MENU_THEME:
        updateSidebarBgColor({ color: value });
        return { menuSetting: { bgColor: value } };

      case HandlerEnum.MENU_SPLIT:
        return { menuSetting: { split: value } };

      case HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE:
        return { menuSetting: { closeMixSidebarOnChange: value } };

      case HandlerEnum.MENU_FIXED:
        return { menuSetting: { fixed: value } };

      case HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR:
        return { menuSetting: { mixSideTrigger: value } };

      case HandlerEnum.MENU_FIXED_MIX_SIDEBAR:
        return { menuSetting: { mixSideFixed: value } };

      // ============transition==================
      case HandlerEnum.OPEN_PAGE_LOADING:
        setPageLoading(false);
        return { transitionSetting: { openPageLoading: value } };

      case HandlerEnum.ROUTER_TRANSITION:
        return { transitionSetting: { basicTransition: value } };

      case HandlerEnum.OPEN_ROUTE_TRANSITION:
        return { transitionSetting: { enable: value } };

      case HandlerEnum.OPEN_PROGRESS:
        return { transitionSetting: { openNProgress: value } };
      // ============root==================

      case HandlerEnum.LOCK_TIME:
        return { lockTime: value };

      case HandlerEnum.FULL_CONTENT:
        return { fullContent: value };

      case HandlerEnum.CONTENT_MODE:
        return { contentMode: value };

      case HandlerEnum.SHOW_BREADCRUMB:
        return { showBreadCrumb: value };

      case HandlerEnum.SHOW_BREADCRUMB_ICON:
        return { showBreadCrumbIcon: value };

      case HandlerEnum.GRAY_MODE:
        updateGrayMode(value);
        return { grayMode: value };

      case HandlerEnum.SHOW_FOOTER:
        return { showFooter: value };

      case HandlerEnum.COLOR_WEAK:
        updateColorWeak(value);
        return { colorWeak: value };

      case HandlerEnum.SHOW_LOGO:
        return { showLogo: value };

      // ============tabs==================
      case HandlerEnum.TABS_SHOW_QUICK:
        return { multiTabsSetting: { showQuick: value } };

      case HandlerEnum.TABS_SHOW:
        return { multiTabsSetting: { show: value } };

      case HandlerEnum.TABS_SHOW_REDO:
        return { multiTabsSetting: { showRedo: value } };

      case HandlerEnum.TABS_SHOW_FOLD:
        return { multiTabsSetting: { showFold: value } };

      case HandlerEnum.TABS_AUTO_COLLAPSE:
        return { multiTabsSetting: { autoCollapse: value } };

      // ============header==================
      case HandlerEnum.HEADER_THEME:
        updateHeaderBgColor({ color: value });
        return { headerSetting: { bgColor: value } };

      case HandlerEnum.HEADER_SEARCH:
        return { headerSetting: { showSearch: value } };

      case HandlerEnum.HEADER_FIXED:
        return { headerSetting: { fixed: value } };

      case HandlerEnum.HEADER_SHOW:
        return { headerSetting: { show: value } };
      default:
        return {};
    }
  };

  const handleSettings = (event: HandlerEnum, value: any) => {
    const config = getConfig(event, value);
    setProjectConfig(config);
    if (event === HandlerEnum.CHANGE_THEME) {
      updateHeaderBgColor();
      updateSidebarBgColor();
    }
  };

  return {
    getConfig,
    handleSettings,
  };
};
