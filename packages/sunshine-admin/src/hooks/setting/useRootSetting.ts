import { ContentEnum } from '@/enums/appEnum';
import { useAppStore, useAppStoreActions } from '@/stores/modules/app';

import { useUpdateTheme } from './useUpdateTheme';

import { ProjectConfig } from '#/config';

type RootSetting = Omit<
  ProjectConfig,
  'locale' | 'headerSetting' | 'menuSetting' | 'multiTabsSetting'
>;

export const useRootSetting = () => {
  const { projectConfig, pageLoading } = useAppStore((state) => ({
    projectConfig: state.getProjectConfig(),
    pageLoading: state.pageLoading,
  }));
  const { setProjectConfig } = useAppStoreActions();
  const { setThemeMode, themeMode, updateRootTheme, updateHeaderBgColor, updateSidebarBgColor } =
    useUpdateTheme();

  const { contentMode } = projectConfig;

  const layoutContentMode = contentMode === ContentEnum.FULL ? ContentEnum.FULL : ContentEnum.FIXED;

  const setRootSetting = (setting: Partial<RootSetting>) => {
    setProjectConfig(setting);
  };

  return {
    ...projectConfig,
    pageLoading,
    setRootSetting,
    setThemeMode,
    layoutContentMode,
    themeMode,
    updateRootTheme,
    updateHeaderBgColor,
    updateSidebarBgColor,
  };
};
