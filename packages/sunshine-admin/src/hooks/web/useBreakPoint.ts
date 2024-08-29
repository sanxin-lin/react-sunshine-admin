import { useEffect } from 'react';
import { useEventListener, useMount } from 'ahooks';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { screenEnum, screenMap, sizeEnum } from '@/enums/breakpointEnum';
import { nextTick } from '@/utils/dom';

interface BreakPointStore {
  globalScreen: sizeEnum;
  globalWidth: number;
  globalRealWidth: number;

  updateGlobalScreen: (v: sizeEnum) => void;
  updateGlobalRealWidth: (v: number) => void;
}

export const useBreakPointStore = create<BreakPointStore>((set) => ({
  globalScreen: sizeEnum.XXL,
  globalWidth: 0,
  globalRealWidth: 0,

  updateGlobalScreen(v) {
    set({ globalScreen: v, globalWidth: screenMap.get(v) });
  },
  updateGlobalRealWidth(v) {
    set({ globalRealWidth: v });
  },
}));

export interface CreateCallbackParams {
  screen: sizeEnum | undefined;
  width: number;
  realWidth: number;
}

export const breakPointListener = (fn?: (opt: CreateCallbackParams) => void) => {
  const { updateGlobalRealWidth, updateGlobalScreen, globalRealWidth, globalScreen, globalWidth } =
    useBreakPointStore(useShallow((state) => state));

  const update = () => {
    const width = document.body.clientWidth;
    const xs = screenMap.get(sizeEnum.XS)!;
    const sm = screenMap.get(sizeEnum.SM)!;
    const md = screenMap.get(sizeEnum.MD)!;
    const lg = screenMap.get(sizeEnum.LG)!;
    const xl = screenMap.get(sizeEnum.XL)!;
    if (width < xs) {
      updateGlobalScreen(sizeEnum.XS);
    } else if (width < sm) {
      updateGlobalScreen(sizeEnum.SM);
    } else if (width < md) {
      updateGlobalScreen(sizeEnum.MD);
    } else if (width < lg) {
      updateGlobalScreen(sizeEnum.LG);
    } else if (width < xl) {
      updateGlobalScreen(sizeEnum.XL);
    } else {
      updateGlobalScreen(sizeEnum.XXL);
    }
    updateGlobalRealWidth(width);
  };

  const onResize = () => {
    fn?.({
      screen: globalScreen,
      width: globalWidth,
      realWidth: globalRealWidth,
    });
  };

  useEventListener(
    'resize',
    () => {
      update();
    },
    {
      target: window,
    },
  );

  useMount(() => {
    update();
  });

  useEffect(() => {
    nextTick(() => {
      onResize();
    });
  }, [globalRealWidth, globalScreen, globalWidth]);

  return {
    screen: globalScreen,
    screenEnum,
    width: globalWidth,
    realWidth: globalRealWidth,
  };
};

export const useBreakPoint = () => {
  const { globalRealWidth, globalScreen, globalWidth } = useBreakPointStore(
    useShallow((state) => state),
  );
  return {
    screen: globalScreen,
    width: globalWidth,
    screenEnum,
    realWidth: globalRealWidth,
  };
};
