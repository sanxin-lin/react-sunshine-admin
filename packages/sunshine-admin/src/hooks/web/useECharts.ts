import { RefObject, useEffect, useRef } from 'react';
import { useThrottleFn, useUnmount } from 'ahooks';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';

import { useAppStore } from '@/stores/modules/app';
import { nextTick } from '@/utils/dom';

import { useMenuSetting } from '../setting/useMenuSetting';

export const useECharts = (
  elRef: RefObject<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'default',
) => {
  const appTheme = useAppStore((state) => state.getThemeMode());
  const { collapsed } = useMenuSetting();
  const _theme = theme === 'default' ? appTheme : theme;
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const cacheOptions = useRef({} as EChartsOption);
  const { run: resize } = useThrottleFn(
    () => {
      chartInstance.current?.resize({
        animation: {
          duration: 300,
          easing: 'quadraticIn',
        },
      });
    },
    {
      wait: 200,
    },
  );
  const getOptions = () => {
    if (_theme !== 'dark') {
      return cacheOptions.current;
    }

    return {
      backgroundColor: 'transparent',
      ...cacheOptions.current,
    } as EChartsOption;
  };

  const initCharts = (t = _theme) => {
    const el = elRef.current;
    if (!el) return;

    chartInstance.current = echarts.init(el, t);

    window.removeEventListener('resize', resize);
    window.addEventListener('resize', resize);
  };

  const setOptions = (inputOptions: EChartsOption, clear = true) => {
    cacheOptions.current = inputOptions;
    const el = elRef.current;
    if (!el) return;
    return new Promise((resolve) => {
      nextTick(() => {
        if (!chartInstance.current) {
          initCharts();
        }

        if (clear) {
          chartInstance.current?.clear();
        }

        chartInstance.current?.setOption(getOptions());

        resolve(null);
      });
    });
  };

  useEffect(() => {
    if (chartInstance) {
      chartInstance.current?.dispose();
      initCharts(_theme);
      setOptions(cacheOptions.current);
    }
  }, [_theme]);

  useEffect(() => {
    resize();
  }, [collapsed]);

  useUnmount(() => {
    if (!chartInstance) return;
    window.removeEventListener('resize', resize);
    chartInstance.current?.dispose();
    chartInstance.current = null;
  });

  const getInstance = (): echarts.ECharts | null => {
    if (!chartInstance) {
      initCharts();
    }
    return chartInstance.current;
  };

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
  };
};
