import { useCreation } from 'ahooks';
import type { ConfigProviderProps } from 'antd';
import { ConfigProvider, theme } from 'antd';

import { ThemeEnum } from '@/enums/appEnum';
import { useAppStore } from '@/stores/modules/app';

export const useThemeConfig = () => {
  const themeMode = useAppStore((state) => state.getThemeMode());
  const { darkAlgorithm } = theme;
  const themeConfig = useCreation(() => {
    const config = {
      token: {
        colorPrimary: '#0960bd',
        colorSuccess: '#55D187',
        colorWarning: '#EFBD47',
        colorError: '#ED6F6F',
        colorInfo: '#0960bd',
      },
    } as ConfigProviderProps['theme'];
    if (themeMode === ThemeEnum.DARK) {
      config!.algorithm = darkAlgorithm;
    }
    // 为了解决 message 不跟随主题色
    ConfigProvider.config({
      theme: config,
    });
    return config;
  }, [themeMode]);

  return { themeConfig };
};
