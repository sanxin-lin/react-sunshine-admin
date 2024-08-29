import { ThemeEnum } from '@/enums/appEnum';
import { useAppStore, useAppStoreActions } from '@/stores/modules/app';
import { updateRootTheme } from '@/theme/dark';
import { updateHeaderBgColor, updateSidebarBgColor } from '@/theme/updateBackground';

export const useUpdateTheme = () => {
  const { themeMode, projectConfig } = useAppStore((state) => ({
    themeMode: state.getThemeMode(),
    projectConfig: state.getProjectConfig(),
  }));
  const { setThemeMode } = useAppStoreActions();
  return {
    themeMode,
    setThemeMode,
    updateRootTheme,
    updateHeaderBgColor: (options: { themeMode?: ThemeEnum; color?: string } = {}) => {
      updateHeaderBgColor({
        ...options,
        headerSetting: projectConfig.headerSetting,
      });
    },
    updateSidebarBgColor: (options: { themeMode?: ThemeEnum; color?: string } = {}) => {
      updateSidebarBgColor({
        ...options,
        menuSetting: projectConfig.menuSetting,
      });
    },
  };
};
