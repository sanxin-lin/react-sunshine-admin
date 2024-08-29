import { useMount } from 'ahooks';
import { merge } from 'lodash-es';

import { ThemeEnum } from '@/enums/appEnum';
import { PROJ_CFG_KEY } from '@/enums/cacheEnum';
import projectSetting from '@/settings/projectSetting';
import { useAppStore, useAppStoreActions } from '@/stores/modules/app';
import { updateRootTheme } from '@/theme/dark';
import { updateHeaderBgColor, updateSidebarBgColor } from '@/theme/updateBackground';
import { updateColorWeak } from '@/theme/updateColorWeak';
import { updateGrayMode } from '@/theme/updateGrayMode';
import { Persistent } from '@/utils/cache/persistent';
import { getCommonStoragePrefix, getStorageShortName } from '@/utils/env';

import type { ProjectConfig } from '#/config';

export function initAppTheme() {
  const { setProjectConfig } = useAppStoreActions();
  const themeMode = useAppStore((state) => state.getThemeMode());
  useMount(() => {
    let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig;
    projCfg = merge(projectSetting, projCfg || {});
    const {
      colorWeak,
      grayMode,

      headerSetting,
      menuSetting,
    } = projCfg;
    const { bgColor: headerBgColor } = headerSetting;
    const { bgColor } = menuSetting;
    try {
      grayMode && updateGrayMode(grayMode);
      colorWeak && updateColorWeak(colorWeak);
    } catch (error) {
      console.log(error);
    }
    setProjectConfig(projCfg);
    // init dark mode
    updateRootTheme(themeMode);

    const updateHeader: any = {
      headerSetting,
      themeMode,
      setProjectConfig,
    };
    const updateMenu: any = {
      menuSetting,
      themeMode,
      setProjectConfig,
    };
    if (themeMode !== ThemeEnum.DARK) {
      headerBgColor && (updateHeader.color = headerBgColor);
      bgColor && (updateMenu.color = bgColor);
    }
    updateHeaderBgColor(updateHeader);
    updateSidebarBgColor(updateMenu);
    setTimeout(() => {
      clearObsoleteStorage();
    }, 16);
  });
}

/**
 * As the version continues to iterate, there will be more and more cache keys stored in localStorage.
 * This method is used to delete useless keys
 */
export function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix();
  const shortPrefix = getStorageShortName();

  [localStorage, sessionStorage].forEach((item: Storage) => {
    Object.keys(item).forEach((key) => {
      if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
        item.removeItem(key);
      }
    });
  });
}
