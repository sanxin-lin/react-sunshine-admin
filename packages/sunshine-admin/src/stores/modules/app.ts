import { merge } from 'lodash-es';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { ThemeEnum } from '@/enums/appEnum';
import { API_ADDRESS, APP_DARK_MODE_KEY, PROJ_CFG_KEY } from '@/enums/cacheEnum';
import { themeMode } from '@/settings/designSetting';
import { Persistent } from '@/utils/cache/persistent';

import type { HeaderSetting, MenuSetting, MultiTabsSetting, ProjectConfig } from '#/config';
import { DeepPartial, TimeoutHandle } from '#/global';
import type { ApiAddress, BeforeMiniState } from '#/store';

export interface AppState {
  isMobile: boolean;
  themeMode?: ThemeEnum;
  // Page loading status
  pageLoading: boolean;
  // project config
  projectConfig: ProjectConfig | null;
  // When the window shrinks, remember some states, and restore these states when the window is restored
  beforeMiniInfo: BeforeMiniState;
}

export interface AppGetter {
  getProjectConfig(): ProjectConfig;
  getThemeMode(): ThemeEnum;
  getMenuThemeMode(): ThemeEnum;
  getHeaderThemeMode(): ThemeEnum;
  getApiAddress(): any;
}

export interface AppAction {
  setIsMobile(flag: boolean): void;
  setPageLoading(loading: boolean): void;
  setThemeMode(mode: ThemeEnum): void;
  setBeforeMiniInfo(state: BeforeMiniState): void;
  setProjectConfig(config: DeepPartial<ProjectConfig>): void;
  setMenuSetting(setting: Partial<MenuSetting>): void;
  setHeaderSetting(setting: Partial<HeaderSetting>): void;
  setMultiTabsSetting(setting: Partial<MultiTabsSetting>): void;
  resetAllState(): void;
  setPageLoadingAction(loading: boolean): Promise<void>;
  setApiAddress(config: ApiAddress): void;
}

export type AppStore = AppState & AppGetter & AppAction;

let timeId: TimeoutHandle;
export const useAppStore = create<AppStore>((set, get) => ({
  isMobile: false,
  themeMode: undefined,
  pageLoading: false,
  projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
  beforeMiniInfo: {},

  getProjectConfig() {
    return get().projectConfig || ({} as ProjectConfig);
  },

  getThemeMode: () =>
    (get().themeMode || localStorage.getItem(APP_DARK_MODE_KEY) || themeMode) as ThemeEnum,

  getMenuThemeMode: () => {
    // return get().getThemeMode();
    return ThemeEnum.DARK;
  },

  getHeaderThemeMode: () => {
    return get().getThemeMode();
  },

  getApiAddress() {
    return JSON.parse(localStorage.getItem(API_ADDRESS) || '{}');
  },

  setIsMobile(flag) {
    set({ isMobile: flag });
  },

  setPageLoading(loading) {
    set({ pageLoading: loading });
  },

  setThemeMode(mode) {
    set({ themeMode: mode });
    localStorage.setItem(APP_DARK_MODE_KEY, mode);
  },

  setBeforeMiniInfo(state) {
    set({ beforeMiniInfo: state });
  },

  setProjectConfig: (config) => {
    const projectConfig = merge({ ...(get().projectConfig || {}) }, config) as ProjectConfig;
    set(() => ({
      projectConfig,
    }));
    Persistent.setLocal(PROJ_CFG_KEY, projectConfig);
  },
  setMenuSetting(setting) {
    const { getProjectConfig, setProjectConfig } = get();
    const menuSetting = merge(getProjectConfig().menuSetting, setting);
    setProjectConfig({ menuSetting });
  },
  setHeaderSetting(setting) {
    const { getProjectConfig, setProjectConfig } = get();
    const headerSetting = merge(getProjectConfig().headerSetting, setting);
    setProjectConfig({ headerSetting });
  },
  setMultiTabsSetting(setting) {
    const { getProjectConfig, setProjectConfig } = get();
    const multiTabsSetting = merge(getProjectConfig().multiTabsSetting, setting);
    setProjectConfig({ multiTabsSetting });
  },

  async resetAllState() {
    // TODO router
    //   resetRouter();
    Persistent.clearAll();
  },
  async setPageLoadingAction(loading: boolean): Promise<void> {
    if (loading) {
      clearTimeout(timeId);
      // Prevent flicker
      timeId = setTimeout(() => {
        get().setPageLoading(loading);
      }, 50);
    } else {
      get().setPageLoading(loading);
      clearTimeout(timeId);
    }
  },
  setApiAddress(config: ApiAddress): void {
    localStorage.setItem(API_ADDRESS, JSON.stringify(config));
  },
}));

export const useAppStoreActions = () => {
  return useAppStore(
    useShallow((state) => ({
      setIsMobile: state.setIsMobile,
      setThemeMode: state.setThemeMode,
      setPageLoading: state.setPageLoading,
      setBeforeMiniInfo: state.setBeforeMiniInfo,
      setMenuSetting: state.setMenuSetting,
      setHeaderSetting: state.setHeaderSetting,
      setProjectConfig: state.setProjectConfig,
      setMultiTabsSetting: state.setMultiTabsSetting,
      setApiAddress: state.setApiAddress,
      setPageLoadingAction: state.setPageLoadingAction,
      resetAllState: state.resetAllState,
    })),
  );
};
