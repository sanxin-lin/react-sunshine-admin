import { ThemeEnum } from '@/enums/appEnum';
// import { AppStore } from '@/stores/modules/app';
import { darken, lighten } from '@/utils/color';

import { setCssVar } from './util';

import { HeaderSetting, MenuSetting } from '#/config';

const HEADER_BG_COLOR_VAR = '--header-bg-color';
const HEADER_BG_HOVER_COLOR_VAR = '--header-bg-hover-color';
const HEADER_MENU_ACTIVE_BG_COLOR_VAR = '--header-active-menu-bg-color';

const SIDER_DARK_BG_COLOR = '--sider-dark-bg-color';
const SIDER_DARK_DARKEN_BG_COLOR = '--sider-dark-darken-bg-color';
const SIDER_LIGHTEN_BG_COLOR = '--sider-dark-lighten-bg-color';

interface UpdateBgColorProps {
  themeMode?: ThemeEnum;
  // setProjectConfig: AppStore['setProjectConfig'];
  color?: string;
}

interface UpdateHeaderBgColorProps extends UpdateBgColorProps {
  headerSetting: HeaderSetting;
}
interface UpdateSidebarBgColorProps extends UpdateBgColorProps {
  menuSetting: MenuSetting;
}

/**
 * Change the background color of the top header
 * @param color
 */
export function updateHeaderBgColor({
  themeMode,
  headerSetting,
  // setProjectConfig,
  color,
}: UpdateHeaderBgColorProps) {
  if (!color) {
    if (themeMode === ThemeEnum.DARK) {
      color = '#151515';
    } else {
      color = headerSetting.bgColor;
    }
  }

  // bg color
  setCssVar(HEADER_BG_COLOR_VAR, color);

  // hover color
  const hoverColor = lighten(color!, 6);
  setCssVar(HEADER_BG_HOVER_COLOR_VAR, hoverColor);
  setCssVar(HEADER_MENU_ACTIVE_BG_COLOR_VAR, hoverColor);

  // Determine the depth of the color value and automatically switch the theme
  // const isDark = colorIsDark(color!);

  // setProjectConfig({
  //   headerSetting: {
  //     theme: isDark || themeMode ? ThemeEnum.DARK : ThemeEnum.LIGHT,
  //   },
  // });
}

/**
 * Change the background color of the left menu
 * @param color  bg color
 */
export function updateSidebarBgColor({
  themeMode,
  menuSetting,
  // setProjectConfig,
  color,
}: UpdateSidebarBgColorProps) {
  if (!color) {
    if (themeMode === ThemeEnum.DARK) {
      color = '#212121';
    } else {
      color = menuSetting.bgColor;
    }
  }
  setCssVar(SIDER_DARK_BG_COLOR, color);
  setCssVar(SIDER_DARK_DARKEN_BG_COLOR, darken(color!, 6));
  setCssVar(SIDER_LIGHTEN_BG_COLOR, lighten(color!, 5));

  // only #ffffff is light
  // Only when the background color is #fff, the theme of the menu will be changed to light
  // const isLight = ['#fff', '#ffffff'].includes(color!.toLowerCase());

  // setProjectConfig({
  //   menuSetting: {
  //     theme: isLight && !themeMode ? ThemeEnum.LIGHT : ThemeEnum.DARK,
  //   },
  // });
}
