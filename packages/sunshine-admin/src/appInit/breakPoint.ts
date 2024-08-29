import { useRef } from 'react';
import { useLatest } from 'ahooks';

import { screenMap, sizeEnum } from '@/enums/breakpointEnum';
import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';
import { breakPointListener } from '@/hooks/web/useBreakPoint';
import { useAppStore, useAppStoreActions } from '@/stores/modules/app';

export const initBreakPoint = () => {
  const isSetState = useRef(false);
  const { setIsMobile, setProjectConfig, setBeforeMiniInfo } = useAppStoreActions();
  const beforeMiniInfo = useAppStore((state) => state.beforeMiniInfo);
  const projectConfig = useAppStore((state) => state.getProjectConfig());
  const isMobile = useAppStore((state) => state.isMobile);
  const isMobileLatest = useLatest(isMobile);
  const handleRestoreState = () => {
    if (isMobileLatest.current) {
      if (!isSetState.current) {
        isSetState.current = true;
        const {
          menuSetting: {
            type: menuType,
            mode: menuMode,
            collapsed: menuCollapsed,
            split: menuSplit,
          } = {},
        } = projectConfig;
        setProjectConfig({
          menuSetting: {
            type: MenuTypeEnum.SIDEBAR,
            mode: MenuModeEnum.INLINE,
            split: false,
          },
        });
        setBeforeMiniInfo({ menuMode, menuCollapsed, menuType, menuSplit });
      }
    } else {
      if (isSetState.current) {
        isSetState.current = false;
        const { menuMode, menuCollapsed, menuType, menuSplit } = beforeMiniInfo;
        setProjectConfig({
          menuSetting: {
            type: menuType,
            mode: menuMode,
            collapsed: menuCollapsed,
            split: menuSplit,
          },
        });
      }
    }
  };

  breakPointListener(({ width }) => {
    const lgWidth = screenMap.get(sizeEnum.LG);
    if (lgWidth) {
      setIsMobile(width - 1 < lgWidth);
      isMobileLatest.current = width - 1 < lgWidth;
    }
    handleRestoreState();
  });
};
